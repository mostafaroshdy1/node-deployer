import { Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { CreateStripeDto } from './dto/create-stripe.dto';
import { PrismaService } from 'src/prisma.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

@Injectable()
export class StripeService {
  constructor(private prisma: PrismaService) {}

  async createCheckoutSession(createStripeDto: CreateStripeDto) {
    console.log('Success');

    // Find the user by providerId
    const user = await this.prisma.user.findUnique({
      where: { id: createStripeDto.user_id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: createStripeDto.description,
            },
            unit_amount: createStripeDto.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: createStripeDto.urlSuccess,
      cancel_url: createStripeDto.urlCancel,
      customer_email: createStripeDto.email,
      metadata: { providerId: user.providerId }, // Use providerId for metadata
    });

    // Record the transaction in the database
    await this.prisma.transaction.create({
      data: {
        userId: user.id, // Use user.id (ObjectId) in the transaction
        amount: createStripeDto.price,
        type: 'STRIPE',
        description: createStripeDto.description,
        urlSuccess: createStripeDto.urlSuccess,
        urlCancel: createStripeDto.urlCancel,
        email: createStripeDto.email,
      },
    });
    return session;
  }

  async handleWebhook(req: any) {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      throw new NotFoundException(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'charge.succeeded':
        await this.handleChargeSucceeded(event.data.object as Stripe.Charge);
        break;
      case 'payment_intent.succeeded':
        await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.created':
        console.log('Payment intent created event received');
        break;
      case 'charge.updated':
        console.log('Charge updated event received');
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const providerId = session.metadata.providerId;

    // Find the user by providerId
    const user = await this.prisma.user.findUnique({
      where: { id: providerId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user balance
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        balance: {
          increment: session.amount_total / 100,
        },
      },
    });
  }

  private async handleChargeSucceeded(charge: Stripe.Charge) {
    console.log('Charge succeeded:', charge);
    // Implement any additional logic needed for charge.succeeded events
  }

  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    console.log('Payment intent succeeded:', paymentIntent);
    // Implement any additional logic needed for payment_intent.succeeded events
  }
}
