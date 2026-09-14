import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class TransactionGridHelperService {

  formatDate(value: any): string {

    if (!value) {
      return "";
    }

    return new Intl.DateTimeFormat(
      "en-IN"
    ).format(new Date(value));
  }

  formatAmount(value: any): string {

    const amount =
      Number(value) || 0;

    if (amount === 0) {
      return "";
    }

    const formatted =
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
      }).format(amount);

    return `
      <span style="
        color:${amount > 0
          ? "var(--success-color)"
          : "var(--danger-color)"};
        font-weight:bold">
        ${formatted}
      </span>
    `;
  }

  formatDebit(value: any): string {

    const amount =
      Number(value) || 0;

    if (amount === 0) {
      return "";
    }

    const formatted =
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
      }).format(amount);

    return `
      <span style="
        color:var(--danger-color);
        font-weight:bold">
        ${formatted}
      </span>
    `;
  }

  formatOverSpent(value: any): string {

    if (value) {

      return `
        <span style="
          color:var(--danger-color);
          font-weight:bold">
          Overspent
        </span>
      `;
    }

    return `
      <span style="
        color:var(--success-color);
        font-weight:bold">
        Available
      </span>
    `;
  }

  formatSourceOrReason(
    description: string,
    sourceOrReason: string
  ): string {

    const descriptionText =
      description?.toLowerCase() ?? "";

    if (
      descriptionText.includes(
        "emergency"
      )
    ) {

      return `
        <span style="
          color:var(--danger-color);
          font-weight:bold">
          ${sourceOrReason}
        </span>
      `;
    }

    if (
      descriptionText.includes(
        "return"
      )
    ) {

      return `
        <span style="
          color:var(--success-color);
          font-weight:bold">
          ${sourceOrReason}
        </span>
      `;
    }

    if (
      descriptionText.includes(
        "recharge"
      )
    ) {

      return `
        <span style="
          color:var(--theme-accent-orange);
          font-weight:bold">
          ${sourceOrReason}
        </span>
      `;
    }

    return `
      <span style="
        color:var(--theme-text);
        font-weight:bold">
        ${sourceOrReason}
      </span>
    `;
  }

  formatSummaryAmount(
    value: any,
    category?: string
  ): string {

    const amount =
      Number(value) || 0;

    if (amount === 0) {
      return "";
    }

    const formatted =
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
      }).format(amount);

    let cssVariable =
      amount > 0
        ? "var(--success-color)"
        : "var(--danger-color)";

    if (category === "Income") {
      cssVariable =
        "var(--success-color)";
    }

    if (category === "Expense") {
      cssVariable =
        "var(--danger-color)";
    }

    return `
      <span style="
        color:${cssVariable};
        font-weight:bold">
        ${formatted}
      </span>
    `;
  }
}