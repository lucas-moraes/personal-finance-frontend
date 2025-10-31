"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useApi } from "@/service/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  username: z.string({ message: "Nome de usuário é obrigatório" }).trim(),
  password: z.string({ message: "Senha é obrigatória" }).min(8, "A senha deve ter pelo menos 8 caracteres"),
});

export const LoginPage = () => {
  const navigate = useNavigate();
  const { useLogin, useToken } = useApi();
  useToken();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Form Data:", data);
    const resp = await useLogin({ email: data.username, password: data.password });

    if (!resp) {
      form.setError("password", { message: "Nome de usuário ou senha inválidos" });
    }

    navigate({ to: "/app/home" });
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
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                Login
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};
