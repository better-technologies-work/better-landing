"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

let registered = false;

export async function registerQuillExtensions(_quill?: any) {
  if (registered || typeof window === "undefined") return;
  registered = true;
}

export function insertTable(quill: any, rows: number = 3, cols: number = 3) {
  if (!quill) return;
  quill.focus();
  const range = quill.getSelection(true);
  const tableHtml = buildTableHtml(rows, cols);
  if (range.length > 0) quill.deleteText(range.index, range.length, "user");
  quill.clipboard.dangerouslyPasteHTML(range.index, tableHtml);
}

function buildTableHtml(rows: number, cols: number): string {
  let html = "<table><tbody>";
  for (let r = 0; r < rows; r++) {
    html += "<tr>";
    for (let c = 0; c < cols; c++) {
      html += r === 0 ? "<th><br></th>" : "<td><br></td>";
    }
    html += "</tr>";
  }
  html += "</tbody></table>";
  return html;
}

function getCellFromQuill(quill: any): HTMLElement | null {
  const range = quill.getSelection();
  if (!range) return null;
  const [leaf] = quill.getLeaf(range.index);
  if (!leaf?.domNode) return null;
  const node = leaf.domNode as HTMLElement;
  const el = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  if (!el) return null;
  return el.closest("td, th");
}

function replaceTable(quill: any, oldOuterHtml: string, newOuterHtml: string) {
  const tables = quill.root.querySelectorAll("table");
  for (const table of tables) {
    if (table.outerHTML === oldOuterHtml) {
      const temp = document.createElement("div");
      temp.innerHTML = newOuterHtml;
      const newTable = temp.firstElementChild;
      if (newTable) {
        table.parentNode?.replaceChild(newTable, table);
        quill.update();
      }
      break;
    }
  }
}

export function addTableRow(quill: any) {
  if (!quill) return;
  const td = getCellFromQuill(quill);
  if (!td) return;

  const tr = td.closest("tr");
  if (!tr) return;
  const table = td.closest("table");
  if (!table) return;

  const oldHtml = table.outerHTML; // save BEFORE modifying

  const cols = tr.querySelectorAll("td, th").length;
  const newRow = document.createElement("tr");
  for (let c = 0; c < cols; c++) {
    const cell = document.createElement("td");
    cell.innerHTML = "<br>";
    newRow.appendChild(cell);
  }
  tr.parentNode?.insertBefore(newRow, tr.nextSibling);

  replaceTable(quill, oldHtml, table.outerHTML);
}

export function addTableColumn(quill: any) {
  if (!quill) return;
  const td = getCellFromQuill(quill);
  if (!td) return;

  const table = td.closest("table");
  if (!table) return;

  const oldHtml = table.outerHTML; // save BEFORE modifying

  const cellIndex = Array.from(td.parentElement?.children || []).indexOf(td);

  table.querySelectorAll("tr").forEach((row: Element) => {
    const refCell = row.children[cellIndex];
    if (!refCell) return;
    const newCell = document.createElement(refCell.tagName === "TH" ? "th" : "td");
    newCell.innerHTML = "<br>";
    if (refCell.nextSibling) {
      row.insertBefore(newCell, refCell.nextSibling);
    } else {
      row.appendChild(newCell);
    }
  });

  replaceTable(quill, oldHtml, table.outerHTML);
}

export function removeTableRow(quill: any) {
  if (!quill) return;
  const td = getCellFromQuill(quill);
  if (!td) return;

  const tr = td.closest("tr");
  if (!tr) return;
  const table = td.closest("table");
  if (!table) return;

  const oldHtml = table.outerHTML; // save BEFORE modifying

  if (table.querySelectorAll("tr").length <= 1) {
    replaceTable(quill, oldHtml, "<p><br></p>");
  } else {
    tr.remove();
    replaceTable(quill, oldHtml, table.outerHTML);
  }
}

export function removeTableColumn(quill: any) {
  if (!quill) return;
  const td = getCellFromQuill(quill);
  if (!td) return;

  const table = td.closest("table");
  if (!table) return;

  if ((td.parentElement?.children.length || 0) <= 1) return;

  const oldHtml = table.outerHTML; // save BEFORE modifying

  const cellIndex = Array.from(td.parentElement?.children || []).indexOf(td);

  table.querySelectorAll("tr").forEach((row: Element) => {
    if (row.children[cellIndex]) {
      row.children[cellIndex].remove();
    }
  });

  replaceTable(quill, oldHtml, table.outerHTML);
}
