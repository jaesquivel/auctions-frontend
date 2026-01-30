'use client';

import * as Clerk from '@clerk/elements/common';
import * as SignIn from '@clerk/elements/sign-in';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Gavel, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignInPage() {
  const params = useParams();
  const locale = (params.locale as string) || 'es';

  const t = {
    es: {
      title: 'Iniciar Sesión',
      subtitle: 'Bienvenido de vuelta',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      continue: 'Continuar',
      signIn: 'Iniciar Sesión',
      noAccount: '¿No tienes cuenta?',
      signUp: 'Regístrate',
      forgotPassword: '¿Olvidaste tu contraseña?',
      verificationTitle: 'Verificar correo electrónico',
      verificationSubtitle: 'Ingresa el código enviado a tu correo',
      code: 'Código de verificación',
      verify: 'Verificar',
      resend: 'Reenviar código',
      backToSignIn: 'Volver a iniciar sesión',
      twoFactorTitle: 'Verificación de dos factores',
      twoFactorSubtitle: 'Ingresa el código de tu aplicación de autenticación',
      totpCode: 'Código de autenticación',
      useBackupCode: 'Usar código de respaldo',
      backupCodeTitle: 'Código de respaldo',
      backupCodeSubtitle: 'Ingresa uno de tus códigos de respaldo',
      backupCode: 'Código de respaldo',
      useTOTP: 'Usar aplicación de autenticación',
    },
    en: {
      title: 'Sign In',
      subtitle: 'Welcome back',
      email: 'Email',
      password: 'Password',
      continue: 'Continue',
      signIn: 'Sign In',
      noAccount: "Don't have an account?",
      signUp: 'Sign up',
      forgotPassword: 'Forgot password?',
      verificationTitle: 'Verify your email',
      verificationSubtitle: 'Enter the code sent to your email',
      code: 'Verification code',
      verify: 'Verify',
      resend: 'Resend code',
      backToSignIn: 'Back to sign in',
      twoFactorTitle: 'Two-factor authentication',
      twoFactorSubtitle: 'Enter the code from your authenticator app',
      totpCode: 'Authentication code',
      useBackupCode: 'Use backup code',
      backupCodeTitle: 'Backup code',
      backupCodeSubtitle: 'Enter one of your backup codes',
      backupCode: 'Backup code',
      useTOTP: 'Use authenticator app',
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

      <SignIn.Root>
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <div className="w-full max-w-md">
              <SignIn.Step name="start">
                <div className="bg-card border border-border rounded-lg shadow-lg p-8">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">{text.title}</h1>
                    <p className="text-muted-foreground mt-1">{text.subtitle}</p>
                  </div>

                  <Clerk.GlobalError className="text-sm text-destructive text-center mb-4" />

                  <div className="space-y-4">
                    <Clerk.Field name="identifier">
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

                    <SignIn.Action submit asChild>
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
                    </SignIn.Action>
                  </div>

                  <p className="text-center text-sm text-muted-foreground mt-6">
                    {text.noAccount}{' '}
                    <Link
                      href={`/${locale}/sign-up`}
                      className="text-primary hover:underline font-medium"
                    >
                      {text.signUp}
                    </Link>
                  </p>
                </div>
              </SignIn.Step>

              <SignIn.Step name="verifications">
                <div className="bg-card border border-border rounded-lg shadow-lg p-8">
                  <SignIn.Strategy name="email_code">
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

                      <SignIn.Action submit asChild>
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
                      </SignIn.Action>

                      <SignIn.Action resend asChild>
                        <Button variant="link" className="w-full" disabled={isGlobalLoading}>
                          {text.resend}
                        </Button>
                      </SignIn.Action>
                    </div>
                  </SignIn.Strategy>

                  <SignIn.Strategy name="password">
                    <div className="text-center mb-6">
                      <h1 className="text-2xl font-bold">{text.title}</h1>
                      <p className="text-muted-foreground mt-1">{text.subtitle}</p>
                    </div>

                    <Clerk.GlobalError className="text-sm text-destructive text-center mb-4" />

                    <div className="space-y-4">
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

                      <SignIn.Action submit asChild>
                        <Button className="w-full" disabled={isGlobalLoading}>
                          <Clerk.Loading>
                            {(isLoading) =>
                              isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                text.signIn
                              )
                            }
                          </Clerk.Loading>
                        </Button>
                      </SignIn.Action>

                      <SignIn.Action navigate="forgot-password" asChild>
                        <Button variant="link" className="w-full">
                          {text.forgotPassword}
                        </Button>
                      </SignIn.Action>
                    </div>
                  </SignIn.Strategy>

                  <SignIn.Strategy name="totp">
                    <div className="text-center mb-6">
                      <h1 className="text-2xl font-bold">{text.twoFactorTitle}</h1>
                      <p className="text-muted-foreground mt-1">{text.twoFactorSubtitle}</p>
                    </div>

                    <Clerk.GlobalError className="text-sm text-destructive text-center mb-4" />

                    <div className="space-y-4">
                      <Clerk.Field name="code">
                        <Clerk.Label className="text-sm font-medium">{text.totpCode}</Clerk.Label>
                        <Clerk.Input asChild>
                          <Input
                            type="text"
                            placeholder="123456"
                            className="mt-1 text-center text-lg tracking-widest"
                            disabled={isGlobalLoading}
                            autoComplete="one-time-code"
                          />
                        </Clerk.Input>
                        <Clerk.FieldError className="text-sm text-destructive mt-1" />
                      </Clerk.Field>

                      <SignIn.Action submit asChild>
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
                      </SignIn.Action>

                      <SignIn.Action navigate="choose-strategy" asChild>
                        <Button variant="link" className="w-full">
                          {text.useBackupCode}
                        </Button>
                      </SignIn.Action>
                    </div>
                  </SignIn.Strategy>

                  <SignIn.Strategy name="backup_code">
                    <div className="text-center mb-6">
                      <h1 className="text-2xl font-bold">{text.backupCodeTitle}</h1>
                      <p className="text-muted-foreground mt-1">{text.backupCodeSubtitle}</p>
                    </div>

                    <Clerk.GlobalError className="text-sm text-destructive text-center mb-4" />

                    <div className="space-y-4">
                      <Clerk.Field name="code">
                        <Clerk.Label className="text-sm font-medium">{text.backupCode}</Clerk.Label>
                        <Clerk.Input asChild>
                          <Input
                            type="text"
                            className="mt-1 text-center text-lg tracking-widest"
                            disabled={isGlobalLoading}
                          />
                        </Clerk.Input>
                        <Clerk.FieldError className="text-sm text-destructive mt-1" />
                      </Clerk.Field>

                      <SignIn.Action submit asChild>
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
                      </SignIn.Action>

                      <SignIn.Action navigate="choose-strategy" asChild>
                        <Button variant="link" className="w-full">
                          {text.useTOTP}
                        </Button>
                      </SignIn.Action>
                    </div>
                  </SignIn.Strategy>

                  <SignIn.Action navigate="start" asChild>
                    <Button variant="ghost" className="w-full mt-4">
                      {text.backToSignIn}
                    </Button>
                  </SignIn.Action>
                </div>
              </SignIn.Step>

              <SignIn.Step name="choose-strategy">
                <div className="bg-card border border-border rounded-lg shadow-lg p-8">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">{text.twoFactorTitle}</h1>
                  </div>

                  <Clerk.GlobalError className="text-sm text-destructive text-center mb-4" />

                  <div className="space-y-3">
                    <SignIn.SupportedStrategy name="totp" asChild>
                      <Button variant="outline" className="w-full">
                        {text.useTOTP}
                      </Button>
                    </SignIn.SupportedStrategy>

                    <SignIn.SupportedStrategy name="backup_code" asChild>
                      <Button variant="outline" className="w-full">
                        {text.useBackupCode}
                      </Button>
                    </SignIn.SupportedStrategy>
                  </div>

                  <SignIn.Action navigate="start" asChild>
                    <Button variant="ghost" className="w-full mt-4">
                      {text.backToSignIn}
                    </Button>
                  </SignIn.Action>
                </div>
              </SignIn.Step>
            </div>
          )}
        </Clerk.Loading>
      </SignIn.Root>
    </main>
  );
}