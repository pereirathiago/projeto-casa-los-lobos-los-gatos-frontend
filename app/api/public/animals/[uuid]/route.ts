import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
const API_TOKEN = process.env.API_TOKEN;

export async function GET(
  request: Request,
  { params }: { params: { uuid: string } },
) {
  try {
    if (!API_TOKEN) {
      return NextResponse.json(
        { error: 'Token de API não configurado' },
        { status: 500 },
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/public/animals/${params.uuid}`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Animal não encontrado' },
          { status: 404 },
        );
      }
      throw new Error('Erro ao buscar animal');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro na API de animal:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar animal' },
      { status: 500 },
    );
  }
}
