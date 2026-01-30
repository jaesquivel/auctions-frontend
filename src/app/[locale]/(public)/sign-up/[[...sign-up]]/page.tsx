'use client';

import * as Clerk from '@clerk/elements/common';
import * as SignUp from '@clerk/elements/sign-up';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Gavel, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignUpPage() {
  const params = useParams();
  const locale = (params.locale as string) || 'es';

  const t = {
    es: {
      title: 'Crear Cuenta',
      subtitle: 'Regístrate para comenzar',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      firstName: 'Nombre',
      lastName: 'Apellido',
      continue: 'Continuar',
      signUp: 'Crear Cuenta',
      hasAccount: '¿Ya tienes cuenta?',
      signIn: 'Iniciar Sesión',
      verificationTitle: 'Verificar correo electrónico',
      verificationSubtitle: 'Ingresa el código enviado a tu correo',
      code: 'Código de verificación',
      verify: 'Verificar',
      resend: 'Reenviar código',
      backToSignUp: 'Volver al registro',
    },
    en: {
      title: 'Create Account',
      subtitle: 'Sign up to get started',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      continue: 'Continue',
      signUp: 'Sign Up',
      hasAccount: 'Already have an account?',
      signIn: 'Sign in',
      verificationTitle: 'Verify your email',
      verificationSubtitle: 'Enter the code sent to your email',
      code: 'Verification code',
      verify: 'Verify',
      resend: 'Resend code',
      backToSignUp: 'Back to sign up',
    },
  };

  const text = t[locale as keyof typeof t] || t.es;

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <Link href={`/${locale}`} className="flex items-center gap-2 mb-8">
        <Gavel className="h-8 w-8 text-primary" />
        <span className="text-2xl font-bold">
          {locale === 'es' ? 'Remates Judiciales' : 'Judicial Auctions'}
        </span>
      </Link>

      <SignUp.Root>
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <div className="w-full max-w-md">
              <SignUp.Step name="start">
                <div className="bg-card border border-border rounded-lg shadow-lg p-8">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">{text.title}</h1>
                    <p className="text-muted-foreground mt-1">{text.subtitle}</p>
                  </div>

                  <Clerk.GlobalError className="text-sm text-destructive text-center mb-4" />

                  <div className="space-y-4">
                    <Clerk.Field name="emailAddress">
                      <Clerk.Label className="text-sm font-medium">{text.email}</Clerk.Label>
                      <Clerk.Input asChild>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          className="mt-1"
                          disabled={isGlobalLoading}
                        />
                      </Clerk.Input>
                      <Clerk.FieldError className="text-sm text-destructive mt-1" />
                    </Clerk.Field>

                    <Clerk.Field name="password">
                      <Clerk.Label className="text-sm font-medium">{text.password}</Clerk.Label>
                      <Clerk.Input asChild>
                        <Input
                          type="password"
                          className="mt-1"
                          disabled={isGlobalLoading}
                        />
                      </Clerk.Input>
                      <Clerk.FieldError className="text-sm text-destructive mt-1" />
                    </Clerk.Field>

                    <SignUp.Action submit asChild>
                      <Button className="w-full" disabled={isGlobalLoading}>
                        <Clerk.Loading>
                          {(isLoading) =>
                            isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              text.continue
                            )
                          }
                        </Clerk.Loading>
                      </Button>
                    </SignUp.Action>
                  </div>

                  <p className="text-center text-sm text-muted-foreground mt-6">
                    {text.hasAccount}{' '}
                    <Link
                      href={`/${locale}/sign-in`}
                      className="text-primary hover:underline font-medium"
                    >
                      {text.signIn}
                    </Link>
                  </p>
                </div>
              </SignUp.Step>

              <SignUp.Step name="verifications">
                <div className="bg-card border border-border rounded-lg shadow-lg p-8">
                  <SignUp.Strategy name="email_code">
                    <div className="text-center mb-6">
                      <h1 className="text-2xl font-bold">{text.verificationTitle}</h1>
                      <p className="text-muted-foreground mt-1">{text.verificationSubtitle}</p>
                    </div>

                    <Clerk.GlobalError className="text-sm text-destructive text-center mb-4" />

                    <div className="space-y-4">
                      <Clerk.Field name="code">
                        <Clerk.Label className="text-sm font-medium">{text.code}</Clerk.Label>
                        <Clerk.Input asChild>
                          <Input
                            type="text"
                            placeholder="123456"
                            className="mt-1 text-center text-lg tracking-widest"
                            disabled={isGlobalLoading}
                          />
                        </Clerk.Input>
                        <Clerk.FieldError className="text-sm text-destructive mt-1" />
                      </Clerk.Field>

                      <SignUp.Action submit asChild>
                        <Button className="w-full" disabled={isGlobalLoading}>
                          <Clerk.Loading>
                            {(isLoading) =>
                              isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                text.verify
                              )
                            }
                          </Clerk.Loading>
                        </Button>
                      </SignUp.Action>

                      <SignUp.Action resend asChild>
                        <Button variant="link" className="w-full" disabled={isGlobalLoading}>
                          {text.resend}
                        </Button>
                      </SignUp.Action>
                    </div>
                  </SignUp.Strategy>

                  <SignUp.Action navigate="start" asChild>
                    <Button variant="ghost" className="w-full mt-4">
                      {text.backToSignUp}
                    </Button>
                  </SignUp.Action>
                </div>
              </SignUp.Step>

              <SignUp.Step name="continue">
                <div className="bg-card border border-border rounded-lg shadow-lg p-8">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">{text.title}</h1>
                    <p className="text-muted-foreground mt-1">{text.subtitle}</p>
                  </div>

                  <Clerk.GlobalError className="text-sm text-destructive text-center mb-4" />

                  <div className="space-y-4">
                    <Clerk.Field name="firstName">
                      <Clerk.Label className="text-sm font-medium">{text.firstName}</Clerk.Label>
                      <Clerk.Input asChild>
                        <Input
                          type="text"
                          className="mt-1"
                          disabled={isGlobalLoading}
                        />
                      </Clerk.Input>
                      <Clerk.FieldError className="text-sm text-destructive mt-1" />
                    </Clerk.Field>

                    <Clerk.Field name="lastName">
                      <Clerk.Label className="text-sm font-medium">{text.lastName}</Clerk.Label>
                      <Clerk.Input asChild>
                        <Input
                          type="text"
                          className="mt-1"
                          disabled={isGlobalLoading}
                        />
                      </Clerk.Input>
                      <Clerk.FieldError className="text-sm text-destructive mt-1" />
                    </Clerk.Field>

                    <SignUp.Action submit asChild>
                      <Button className="w-full" disabled={isGlobalLoading}>
                        <Clerk.Loading>
                          {(isLoading) =>
                            isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              text.signUp
                            )
                          }
                        </Clerk.Loading>
                      </Button>
                    </SignUp.Action>
                  </div>

                  <SignUp.Action navigate="start" asChild>
                    <Button variant="ghost" className="w-full mt-4">
                      {text.backToSignUp}
                    </Button>
                  </SignUp.Action>
                </div>
              </SignUp.Step>
            </div>
          )}
        </Clerk.Loading>
      </SignUp.Root>
    </main>
  );
}