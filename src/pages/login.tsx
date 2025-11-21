"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { shouldOfferTouchID } from "@/lib/platform";
import { useApi } from "@/service/api";
import { authenticateWithTouchID, getStoredCredential, hasStoredCredential } from "@/service/webauthn";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Fingerprint } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  username: z.string({ message: "Nome de usuário é obrigatório" }).trim(),
  password: z.string({ message: "Senha é obrigatória" }).min(8, "A senha deve ter pelo menos 8 caracteres"),
});

export const LoginPage = () => {
  const navigate = useNavigate();
  const { useLogin, useTouchIDLogin, useGetTouchIDChallenge } = useApi();
  const [showTouchID, setShowTouchID] = useState(false);
  const [touchIDAvailable, setTouchIDAvailable] = useState(false);
  const [isTouchIDAuthenticating, setIsTouchIDAuthenticating] = useState(false);
  const [touchIDError, setTouchIDError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Check if Touch ID should be offered
  useEffect(() => {
    const checkTouchID = async () => {
      const shouldOffer = await shouldOfferTouchID();
      setTouchIDAvailable(shouldOffer);
    };
    checkTouchID();
  }, []);

  // Check if username has a stored credential when username changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      const username = value.username;
      if (username && touchIDAvailable) {
        setShowTouchID(hasStoredCredential(username));
      } else {
        setShowTouchID(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, touchIDAvailable]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const resp = await useLogin({ email: data.username, password: data.password });

    if (!resp) {
      form.setError("password", { message: "Nome de usuário ou senha inválidos" });
      return;
    }

    navigate({ to: "/app/home" });
  };

  const handleTouchIDLogin = async () => {
    setIsTouchIDAuthenticating(true);
    setTouchIDError(null);

    try {
      const username = form.getValues("username");
      
      if (!username) {
        setTouchIDError("Por favor, insira o nome de usuário primeiro");
        setIsTouchIDAuthenticating(false);
        return;
      }

      // Get challenge from server
      const challenge = await useGetTouchIDChallenge({ email: username });
      
      if (!challenge) {
        setTouchIDError("Falha ao obter challenge do servidor. Tente novamente.");
        setIsTouchIDAuthenticating(false);
        return;
      }

      // Get stored credential ID
      const credentialId = getStoredCredential(username);
      
      if (!credentialId) {
        setTouchIDError("Nenhuma credencial Touch ID encontrada. Use login tradicional.");
        setIsTouchIDAuthenticating(false);
        return;
      }

      // Authenticate with Touch ID
      const authResult = await authenticateWithTouchID({ 
        challenge,
        credentialId 
      });

      if (!authResult) {
        setTouchIDError("Autenticação Touch ID cancelada ou falhou. Tente novamente ou use senha.");
        setIsTouchIDAuthenticating(false);
        return;
      }

      // Send authentication result to server
      const loginSuccess = await useTouchIDLogin({
        email: username,
        credentialId: authResult.credentialId,
        signature: authResult.signature,
        authenticatorData: authResult.authenticatorData,
        clientDataJSON: authResult.clientDataJSON,
      });

      if (loginSuccess) {
        navigate({ to: "/app/home" });
      } else {
        setTouchIDError("Falha na autenticação Touch ID. Tente usar senha.");
      }
    } catch (error) {
      console.error("Touch ID error:", error);
      setTouchIDError("Erro ao autenticar com Touch ID. Use login tradicional.");
    } finally {
      setIsTouchIDAuthenticating(false);
    }
  };

  return (
    <div className="fixed w-full h-full flex justify-center items-center bg-[url('/src/assets/login-background.webp')] bg-cover bg-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-[300px] bg-blue-500/10 backdrop-blur-sm border border-blue-500/20">
            <CardHeader>
              <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => {
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>{field.name}</FieldLabel>
                        <Input id={field.name} {...field} />
                        <FieldError>{form.formState.errors.username?.message}</FieldError>
                      </Field>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => {
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>{field.name}</FieldLabel>
                        <Input id={field.name} type="password" {...field} />
                        <FieldError>{form.formState.errors.password?.message}</FieldError>
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
              {touchIDError && (
                <div className="mt-2 text-sm text-red-500" role="alert">
                  {touchIDError}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-2">
              {showTouchID && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center gap-2" 
                  onClick={handleTouchIDLogin}
                  disabled={isTouchIDAuthenticating || form.formState.isSubmitting}
                  aria-label="Login with Touch ID"
                >
                  {!isTouchIDAuthenticating && (
                    <>
                      <Fingerprint className="h-4 w-4" />
                      Touch ID
                    </>
                  )}
                  {isTouchIDAuthenticating && <Spinner />}
                </Button>
              )}
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || isTouchIDAuthenticating}>
                {!form.formState.isSubmitting && 'Login'}
                {form.formState.isSubmitting && <Spinner />}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};
