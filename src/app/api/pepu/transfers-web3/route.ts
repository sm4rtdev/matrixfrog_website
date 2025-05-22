// app/api/pepu/transfers-web3/route.ts - Einfache Weiterleitung
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // URL aus der Anfrage extrahieren
  const url = new URL(request.url);
  
  // Neue URL für die Weiterleitung erstellen
  const redirectUrl = new URL(url);
  redirectUrl.pathname = redirectUrl.pathname.replace('/transfers-web3', '/transfers');
  
  // Weiterleitung mit Status 307 (Temporary Redirect)
  return NextResponse.redirect(redirectUrl, 307);
}