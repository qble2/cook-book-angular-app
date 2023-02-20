import { AbstractControl } from "@angular/forms";

export function requireMatch(control: AbstractControl) {
  const selection: any = control.value;
  // if (typeof selection === "string") {
  //   return { requireMatch: true };
  // }
  if (typeof selection === "string" && selection !== "") {
    return { requireMatch: true };
  }
  return null;
}
