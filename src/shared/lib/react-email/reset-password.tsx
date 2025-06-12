import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface Props {
  name: string;
  url: string;
}

export const ResetPassword = ({ url, name }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your password here 🔐</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded-2xl border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Heading className="font-extrabold">Gastrify</Heading>
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Reset your password
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {name},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              In order to reset your password, please click the button below
              (this link will expire in one hour).
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded-2xl bg-black px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={url}
              >
                Reset password
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{" "}
              <Link
                href={url}
                className="text-wrap break-all text-blue-600 no-underline"
              >
                {url}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ResetPassword.PreviewProps = {
  url: "https://gastrify.aragundy.com/api/auth/reset-password/JiiTi6msThuQRQghOkN1pWpR?callbackURL=/reset-password",
  name: "David Aragundy",
} as Props;

export default ResetPassword;
