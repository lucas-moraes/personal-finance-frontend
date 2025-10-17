"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";

export const LoginPage = () => {
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      console.log(`=> form onSubmit`, value);
    },
  });

  return (
    <div className="fixed w-full h-full flex justify-center items-center bg-[url('/src/assets/login-background.webp')] bg-cover bg-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
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
