export function getEnumKeyByEnumValue(
  myEnum: any,
  enumValue: number | string
): string {
  let keys = Object.keys(myEnum).filter((x) => myEnum[x] == enumValue);
  return keys.length > 0 ? keys[0] : "";
}
