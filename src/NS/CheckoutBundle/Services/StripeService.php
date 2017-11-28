<?php
// src/NS/CheckoutBundle/Services/StripeService.php

namespace NS\CheckoutBundle\Services;

class StripeService
{
  private  $api_key;

  public function __construct(string $api_key)
  {
    $this->api_key = $api_key;
  }

  public function api($endpoint, $datas )
  {

    $curl = curl_init();

    curl_setopt_array($curl,[
      CURLOPT_URL => "https://api.stripe.com/v1/$endpoint",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_USERPWD => $this->api_key,
      CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
      CURLOPT_POSTFIELDS => http_build_query($datas)
    ]);

    $response = json_decode(curl_exec($curl));

    curl_close($curl);

    if (property_exists($response, 'error')) {
      throw new \Exception($response->error->message); 
    }

    return $response;

  // https://stripe.com/docs/sources/customers (doc)

  // Customer
  // curl https://api.stripe.com/v1/customers \
  //    -u sk_test_bQGGYJD7XOqZ34qeSVjghL4C: \
  //    -d source=tok_1BO7xqFnjIw0V8vUWq0d5JZ5 \
  //    -d description="Elizabeth Martinez" \
  //    -d email="elizabeth.martinez.44@example.com"

  // Charge
  // curl https://api.stripe.com/v1/charges \
  //    -u sk_test_bQGGYJD7XOqZ34qeSVjghL4C: \
  //    -d amount=2000 \
  //    -d currency=eur \
  //    -d customer=cus_BlfiMwgeLaBkTZ

  // Plan
  // curl https://api.stripe.com/v1/plans \
  //   -u sk_test_bQGGYJD7XOqZ34qeSVjghL4C: \
  //   -d amount=999 \
  //   -d interval=month \
  //   -d name="Sapphire Staff" \
  //   -d currency=eur \
  //   -d id=sapphire-staff-008

  // Subscription
  // curl https://api.stripe.com/v1/customers/cus_BlfiMwgeLaBkTZ/subscriptions \
  //   -u sk_test_bQGGYJD7XOqZ34qeSVjghL4C: \
  //   -d plan=sapphire-staff-008
 


      // try {
          
      //     $charge = \Stripe\Charge::create(array(
      //         "amount" => $booking->getPrice() * 100, // Amount in cents
      //         "currency" => "eur",
      //         "source" => $token,
      //         "description" => "Paiement My Ticket - Musée du Louvre"
      //     ));  


      // } catch(\Stripe\Error\Card $e) {
      //     $this->addFlash("error","Snif ça marche pas :(");
      //     return $this->redirectToRoute('ns_checkout_confirmation');     
      // }
  }

}
