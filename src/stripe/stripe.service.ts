import { Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { CreateStripeDto } from './dto/create-stripe.dto';
import { PrismaService } from 'src/prisma.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

@Injectable()
export class StripeService {
  constructor(private prisma: PrismaService) {}

  async createCheckoutSession(createStripeDto: CreateStripeDto) {
    // Find the user by providerId
    const user = await this.prisma.user.findUnique({
      where: { providerId: createStripeDto.user_id },
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
    console.log(sig);

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
      case 'payment_intent.succeeded':
        const session = event.data.object;
        const providerId = session.metadata.providerId;

        // Find the user by providerId
        const user = await this.prisma.user.findUnique({
          where: { providerId },
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

        break;
      // Other event types...
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }
}
