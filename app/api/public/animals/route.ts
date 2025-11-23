import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
const PUBLIC_API_TOKEN = process.env.PUBLIC_API_TOKEN;

export async function GET() {
  try {
    if (!PUBLIC_API_TOKEN) {
      return NextResponse.json(
        { error: 'Token de API não configurado' },
        { status: 500 },
      );
    }

    const response = await fetch(`${API_BASE_URL}/public/animals`, {
      headers: {
        Authorization: `Bearer ${PUBLIC_API_TOKEN}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar animais');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro na API de animais:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar animais' },
      { status: 500 },
    );
  }
}
