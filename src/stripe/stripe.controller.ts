import { Controller, Post, Body,Req, Res  ,ValidationPipe, Get } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateStripeDto } from './dto/create-stripe.dto';
import { Request, Response } from 'express';


@Controller('payment')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('stripe')
  async createCheckoutSession(@Body() createStripeDto: CreateStripeDto) {
    return this.stripeService.createCheckoutSession(createStripeDto);
  }

  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.stripeService.handleWebhook(req);
      res.json(result);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  @Get('/success')
  getSuccess(@Req() req: Request, @Res() res: Response){
    return res.status(200).json({msg:'Success'});
  }

  @Get('/cancel')
  getCancel(@Req() req: Request, @Res() res: Response){
    return res.status(200).json({msg:'Cancel'});
  }
}
