const test = require("node:test");
const assert = require("node:assert/strict");

const { validateBody, buildTelegramText } = require("../../api/server.js");

test("validateBody rejects missing name", () => {
  const r = validateBody({ email: "a@b.de", service: "Web", message: "Hallo Welt!" });
  assert.ok(r.errors.includes("name"));
});

test("validateBody rejects bad email", () => {
  const r = validateBody({
    name: "Max",
    email: "not-an-email",
    service: "Web",
    message: "Hallo Welt!",
  });
  assert.ok(r.errors.includes("email"));
});

test("validateBody rejects too-short message", () => {
  const r = validateBody({ name: "Max", email: "a@b.de", service: "Web", message: "kurz" });
  assert.ok(r.errors.includes("message"));
});

test("validateBody flags honeypot", () => {
  const r = validateBody({
    name: "Max",
    email: "a@b.de",
    service: "Web",
    message: "Hallo Welt!",
    website: "http://spam.example",
  });
  assert.ok(r.errors.includes("honeypot"));
});

test("validateBody accepts valid input", () => {
  const r = validateBody({
    name: "Max Mustermann",
    email: "max@example.com",
    service: "Webdesign",
    message: "Ich brauche eine Website für meine Bäckerei.",
  });
  assert.equal(r.errors.length, 0);
});

test("validateBody strips control chars", () => {
  const r = validateBody({
    name: "Max\x00\x01Mustermann",
    email: "max@example.com",
    service: "Web",
    message: "Hallo Welt mit genug Text!",
  });
  assert.equal(r.name, "MaxMustermann");
});

test("validateBody enforces length caps", () => {
  const longMsg = "a".repeat(5000);
  const r = validateBody({
    name: "Max",
    email: "a@b.de",
    service: "Web",
    message: longMsg,
  });
  assert.equal(r.message.length, 2000);
});

test("buildTelegramText escapes Markdown specials in user input", () => {
  const text = buildTelegramText({
    name: "Max [Spammer]",
    email: "a@b.de",
    service: "Web *bold*",
    message: "Hi",
    phone: "",
    company: "",
    revisions: "",
    contactMethod: "egal",
  });
  assert.ok(text.includes("Max \\[Spammer\\]"));
  assert.ok(text.includes("Web \\*bold\\*"));
});

test("buildTelegramText includes WhatsApp link when phone given", () => {
  const text = buildTelegramText({
    name: "Max",
    email: "a@b.de",
    service: "Web",
    message: "Hi",
    phone: "0176 12345678",
    company: "",
    revisions: "",
    contactMethod: "whatsapp",
  });
  assert.ok(text.includes("wa.me/4917612345678"));
});
