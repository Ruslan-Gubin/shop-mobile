import { getFormattedPhone } from "./getFormattedPhone";

describe("getFormattedPhone", () => {
  it("возвращает значение без изменений, если цифр 3 или меньше", () => {
    expect(getFormattedPhone("905")).toBe("905");
    expect(getFormattedPhone("90")).toBe("90");
  });

  it("форматирует 4-6 цифр как XXX XXX", () => {
    expect(getFormattedPhone("905123")).toBe("905 123");
  });

  it("форматирует 7-8 цифр как XXX XXX XXX", () => {
    expect(getFormattedPhone("9051234")).toBe("905 123 4");
    expect(getFormattedPhone("90512345")).toBe("905 123 45");
  });

  it("форматирует 9+ цифр как XXX XXX XX XX", () => {
    expect(getFormattedPhone("9051234567")).toBe("905 123 45 67");
  });

  it("оставляет только цифры при вводе посторонних символов", () => {
    expect(getFormattedPhone("90-51-23")).toBe("905 123");
  });

  it("не выходит за пределы 10 цифр", () => {
    expect(getFormattedPhone("9051234567890")).toBe("905 123 45 67");
  });
});