"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Quill 2 (used under the hood by react-quill-new) ships its own built-in
// table support (TableCell/TableRow blots — this is what was generating
// the `data-row` attributes found in the DOM). All the previous hand-
// rolled DOM manipulation in this file was fighting against that native
// system instead of using it, which is what caused the ragged/cropped
// columns. This file now just delegates to Quill's own 'table' module.
//
// IMPORTANT: the <ReactQuill> instance must have `table: true` added to
// its `modules` prop, or `quill.getModule('table')` will be undefined.

export async function registerQuillExtensions(_quill?: any) {
  // No longer needed — the table module is enabled via the `modules`
  // prop on <ReactQuill> (table: true), not via manual registration.
  // Kept as a no-op so any existing calls to this function don't break.
}

function getTableModule(quill: any) {
  if (!quill) return null;
  const table = quill.getModule("table");
  if (!table) {
    console.error(
      "[QUILL TABLE] Table module not found — make sure `table: true` is set in the ReactQuill `modules` prop."
    );
  }
  return table;
}

export function insertTable(quill: any, rows: number = 3, cols: number = 3) {
  const table = getTableModule(quill);
  if (!table) return;
  quill.focus();
  table.insertTable(rows, cols);
}

export function addTableRow(quill: any) {
  const table = getTableModule(quill);
  if (!table) return;
  quill.focus();
  table.insertRowBelow();
}

export function addTableColumn(quill: any) {
  const table = getTableModule(quill);
  if (!table) return;
  quill.focus();
  table.insertColumnRight();
}

export function removeTableRow(quill: any) {
  const table = getTableModule(quill);
  if (!table) return;
  quill.focus();
  table.deleteRow();
}

export function removeTableColumn(quill: any) {
  const table = getTableModule(quill);
  if (!table) return;
  quill.focus();
  table.deleteColumn();
}