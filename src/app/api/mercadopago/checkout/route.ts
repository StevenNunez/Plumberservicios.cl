import { NextResponse } from 'next/server';
import MercadoPago, { Preference } from 'mercadopago';

export async function POST(request: Request) {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'MERCADO_PAGO_ACCESS_TOKEN no configurado en .env.local' },
      { status: 500 }
    );
  }

  try {
    const { titulo, monto } = await request.json();

    if (!titulo || !monto || monto <= 0) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: titulo y monto.' },
        { status: 400 }
      );
    }

    const client = new MercadoPago({ accessToken });
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: `servicio-${Date.now()}`,
            title: titulo,
            quantity: 1,
            unit_price: Math.round(monto),
            currency_id: 'CLP',
          },
        ],
        payment_methods: {
          excluded_payment_types: [],
          installments: 1,
        },
        statement_descriptor: 'Plumber Servicios SPA',
      },
    });

    return NextResponse.json({
      success: true,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
      preference_id: result.id,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
