# Page snapshot

```yaml
- banner:
    - button "Toggle theme"
- main:
    - link "Gastrify":
        - /url: /
    - heading "Sign up" [level=1]
    - paragraph: Create your account to get started 🎉
    - text: Full Name
    - textbox "Full Name": Test User
    - text: Identification Number
    - textbox "Identification Number": "1234567890"
    - text: Email
    - textbox "Email": user@example.com
    - text: Password
    - textbox "Password": Password123!
    - progressbar "Password strength"
    - paragraph: "Very strong password. Must contain:"
    - list "Password requirements":
        - listitem: At least 8 characters - Requirement met
        - listitem: At least 1 number - Requirement met
        - listitem: At least 1 lowercase letter - Requirement met
        - listitem: At least 1 uppercase letter - Requirement met
        - listitem: At least 1 special character - Requirement met
    - button "Sign up"
    - text: Already have an account?
    - link "Sign in":
        - /url: /sign-in
- button "Open Tanstack query devtools":
    - img
- region "Notifications alt+T"
- alert
- button "Open Next.js Dev Tools":
    - img
```
