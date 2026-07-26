import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { verifyUser } from "@/api/authApi";
import useAuthStore from "@/store/authStore";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");

  const {
    formState: { isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const email = useAuthStore.getState().email;
      const response = await verifyUser({ email, otp });
      console.log(response)

      toast.success(response.data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.response.data.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm bg-card border-border">
        <CardHeader>
          <CardTitle className="font-heading text-2xl text-foreground">
            Verify your email
          </CardTitle>
          <CardDescription>
            We sent a 6-digit code to{" "}
            <span className="text-foreground">name@company.com</span>
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                pattern={REGEXP_ONLY_DIGITS}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={otp.length < 6 && !isSubmitting}
            >
              Verify
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                className="text-link underline underline-offset-4"
              >
                Resend code
              </button>
            </p>
          </CardContent>
        </form>
        <CardFooter className="justify-center border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">
            Wrong email?{" "}
            <Link
              to="/register"
              className="text-link underline underline-offset-4"
            >
              Go back
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
