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
  newEmail: string;
  url: string;
}

export const ChangeEmailVerification = ({ url, name, newEmail }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>Please verify your new email address</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded-2xl border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Heading className="font-extrabold">Gastrify</Heading>
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Change email verification
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {name},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              In order to change your email address ({newEmail}), we need to
              verify it is really you. Click the button below to confirm.
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded-2xl bg-black px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={url}
              >
                Confirm
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

ChangeEmailVerification.PreviewProps = {
  url: "https://gastrify.aragundy.com/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRhdmlkYXJhZ3VuZHlAb3V0bG9vay5jb20iLCJpYXQiOjE3NDE5Njc4NzQsImV4cCI6MTc0MTk3MTQ3NH0.9AjvRxMX1jwIw7XfagZThFe9eTBtc8utmM3VV7F8jqs&callbackURL=/",
  name: "David Aragundy",
} as Props;

export default ChangeEmailVerification;
