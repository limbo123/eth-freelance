# Freelance

**You can only use website with Metamask!**
If you haven't MetaMask extension you can login as:

Developer account:
email: limbaao7@gmail.com;
password: 1

Employer account:
email: olegovramets@gmail.com;
password: 1

## Authentification.

Here is the auth modal with two tabs: login and register;

In login tab the password and email are just checking for existing in firebase.
Register form is kinda more interesting one. After choosing whether you are developer or employer, the last stage will appear. The country is automatically setting from user ip. Email is verifying by smtp protocol.
For verifying ethreum address I created another simple smart-contract (LINK!!!);

## General description.

All tasks and their proposals is stored in main smart-contract (LINK!!!)

Also employer can start chat with any author of proposal to his tasks.
You can send all types of messages in chat: text messages, images, videos, another file types.

To create task, employer must pay the task cost into Task contract, then it will automatically transfer to worker if he will finish the work.
