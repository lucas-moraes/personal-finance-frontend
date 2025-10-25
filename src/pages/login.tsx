"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const inputform = [
  {
    name: "username",
    label: "Nome de usuário",
    type: "text",
    autoComplete: "off",
  },
  {
    name: "password",
    label: "Senha",
    type: "password",
    autoComplete: "off",
  },
];

const formSchema = z.object({
  username: z.string({ message: "Nome de usuário é obrigatório" }).trim(),
  password: z.string({ message: "Senha é obrigatória" }).min(8, "A senha deve ter pelo menos 8 caracteres"),
});

export const LoginPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="fixed w-full h-full flex justify-center items-center bg-[url('/src/assets/login-background.webp')] bg-cover bg-center">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-[300px] bg-blue-500/10 backdrop-blur-sm border border-blue-500/20">
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <form.Field
                name="username"
                children={(field) => {
                  return (
                    <Field>
                      <FieldLabel>{field.name}</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        autoComplete="off"
                      />
                    </Field>
                  );
                }}
              />
              <form.Field
                name="password"
                children={(field) => {
                  return (
                    <Field>
                      <FieldLabel>{field.name}</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        autoComplete="off"
                        type="password"
                      />
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Login
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
