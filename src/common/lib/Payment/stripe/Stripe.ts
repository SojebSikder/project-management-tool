import stripe from 'stripe';
import appConfig from '../../../../config/app.config';

const STRIPE_SECRET_KEY = appConfig().payment.stripe.secret_key;
const Stripe = new stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-10-28.acacia',
});

const STRIPE_WEBHOOK_SECRET = 'wh_xx';
/**
 * Stripe payment method helper
 */
export class StripeMethod {
  static async createCheckoutSession(customer: string, price: string) {
    const success_url = `${
      appConfig().app.url
    }/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${appConfig().app.url}/failed`;

    const session = await Stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customer,
      line_items: [
        {
          price: price,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 14,
      },
      success_url: success_url,
      cancel_url: cancel_url,
    });
    return session;
  }
  /**
   * Add customer to stripe
   * @param email
   * @returns
   */
  static async addNewCustomer({
    user_id,
    name,
    email,
  }: {
    user_id: number;
    name: string;
    email: string;
  }) {
    const customer = await Stripe.customers.create({
      name: name,
      email: email,

      metadata: {
        user_id: user_id,
      },
      description: 'New Customer',
    });
    return customer;
  }

  /**
   * Get customer using id
   * @param id
   * @returns
   */
  static async getCustomerByID(id: string) {
    const customer = await Stripe.customers.retrieve(id);
    return customer;
  }

  /**
   *
   * @param customer
   * @returns
   */
  static async createBillingSession(customer) {
    const session = await Stripe.billingPortal.sessions.create({
      customer: customer,
      return_url: appConfig().app.url,
    });
    return session;
  }

  static createWebhook(rawBody: string, sig: string | string[]) {
    const event = Stripe.webhooks.constructEvent(
      rawBody,
      sig,
      STRIPE_WEBHOOK_SECRET,
    );
    return event;
  }
}
