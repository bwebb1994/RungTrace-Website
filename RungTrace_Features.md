# RungTrace — PLC Tag Diagnostic Tool

## What Is RungTrace?

RungTrace is a standalone desktop application for Allen-Bradley PLC diagnostics. It connects directly to ControlLogix, CompactLogix, Micro800, MicroLogix, and SLC-500 controllers over EtherNet/IP — no RSLinx OPC configuration required — and gives you live tag monitoring, program logic viewing, and powerful diagnostic tools in a single portable executable.

Import your Studio 5000 L5X export and RungTrace becomes a full offline+online diagnostic workstation: browse ladder logic with live PLC values overlaid, trace tag dependencies, cross-reference every usage, and answer "why isn't this turning on?" with one click.

---

## Real-Time Tag Monitoring

- **Live watch list** — Add tags manually, browse them from the PLC, or import them from an L5X file. Poll values continuously at configurable rates from 100 ms to 60 seconds.
- **Multi-PLC support** — Connect to multiple PLCs simultaneously and monitor tags across all of them in a single unified watch list. Each tag shows which PLC it belongs to.
- **Read and write** — Read and write BOOL, SINT, INT, DINT, REAL, LINT, LREAL, and STRING tags. Array elements, UDT members, and program-scoped tags (`Program:MainProgram.LocalTag`) are all supported.
- **Per-tag poll control** — Enable or disable polling on individual tags without affecting the rest. Focus your bandwidth on what matters.
- **Tag descriptions and aliases** — When an L5X file is loaded, tag descriptions and alias mappings from Studio 5000 are automatically displayed alongside each tag.
- **Quality indicators** — Each tag value is color-coded by read quality (good, stale, error) so you can spot communication problems instantly.
- **Write protection** — Writes are disabled by default and require an explicit enable checkbox. Every write is logged with tag name, old value, new value, and success/failure status.
- **Save and reload** — Save your watch list to a JSON file and reload it later. Tag configurations, notes, and poll settings are preserved.
- **CSV export** — Export all current tag values to CSV for reporting, trending in Excel, or archival.

---

## Tag Browser

- **Full PLC tag discovery** — Browse every tag on the connected PLC, organized by scope (controller-scoped, program-scoped, UDT members).
- **Search and filter** — Type to filter by tag name, data type, or description. Save frequently-used filters as named templates for quick reuse.
- **Site-wide search** — Search for a tag across all endpoints on a multi-PLC network. Find every PLC that has a tag named `Motor_Run` without connecting to each one individually.
- **Batch import** — Add all tags matching a filter to the watch list in one click.

---

## L5X Program Logic Viewer

Import a Studio 5000 .L5X export and RungTrace renders your PLC program as interactive ladder logic — no Studio 5000 license needed.

- **Ladder logic rendering** — Full graphical rendering of contacts (XIC/XIO), coils (OTE/OTL/OTU), timers (TON/TOF/RTO), counters (CTU/CTD), math instructions (ADD/SUB/MUL/DIV/MOV/CPT), comparison instructions (EQU/NEQ/GRT/LES/GEQ/LEQ/LIM), and dozens more.
- **Instruction blocks** — Timers, counters, and function blocks are rendered with labeled parameters, status bits (EN, DN, TT, etc.), and current values.
- **Structured text support** — ST routines are displayed with their full source.
- **Add-On Instructions (AOIs)** — AOI definitions are parsed and rendered with their visible parameters, status bits, and internal logic. Click an AOI to jump directly into its logic.
- **Live value overlay** — Select a connected PLC from the dropdown and RungTrace overlays real-time values directly onto the ladder logic. See timer accumulators ticking, contact states highlighted, and coil outputs live — right on the rung.
- **Inline value editing** — Double-click any editable value in an instruction block (timer PRE/ACC, counter values, MOV/ADD operands) to change it directly on the rung. Toggle boolean tags with a single click.
- **Navigation** — Browse programs, routines, and rungs in a tree view. Use back/forward buttons to navigate your viewing history. Search all rungs across all routines by tag name or text.
- **Rung comments** — Studio 5000 rung comments are displayed above each rung, preserving the documentation from your original project.

---

## Tag Trace

Click any tag in the ladder viewer and RungTrace finds every instruction that writes to it — across every program and routine in the project.

- Shows the exact location (program, routine, rung number) and instruction type (OTE, MOV, TON.ACC, etc.) for every write.
- Click any result to navigate directly to that rung.
- Recursive tracing: trace the inputs of the instructions that write to your tag to build a full dependency chain.

---

## Cross-Reference

Find every occurrence of a tag across the entire L5X project — every rung where it appears as a contact, coil, or instruction operand.

- Results show program, routine, rung number, and the instruction context.
- Click any result to jump to that rung in the viewer.

---

## Why Not? Analysis

Select a tag that should be ON but isn't, and RungTrace traces backward through the logic to explain why.

- Builds a visual dependency tree showing every condition in the chain.
- Each node shows whether its condition is satisfied, blocked, or unknown.
- Filter to show only blocking branches to quickly isolate the root cause.
- Configurable trace depth (3, 5, 10, or 20 levels).
- Detects and flags circular references.

---

## Real-Time Plotting

Open the Plot tool to visualize tag values as a scrolling time-series chart.

- Overlay multiple tags on a single chart.
- Adjustable time window from 1 second to 1 hour.
- Configurable sample rate from 50 ms to 1 second.
- Pause and resume the live stream to inspect a moment in time.
- Export all recorded samples to CSV.

---

## Gantt Timeline Tool

The Gantt tool lets you define a sequence of conditions and visualize their timing as a Gantt chart — ideal for diagnosing machine cycle issues, sequencer timing, and state machine behavior.

- Define up to 30 steps, each with a name, color, and one or more trigger conditions.
- Conditions support a wide range of operators: equals, not-equals, less-than, greater-than, contains, becomes true, becomes false, changes, is numeric, zero/nonzero.
- Chain steps with dependencies: "Step B starts only after Step A completes."
- Combine multiple conditions per step with AND/OR logic.
- Adjustable sample rate (50–1,000 ms) and time axis zoom.
- Tracks elapsed time per step, wait time, and total run time.
- Save and load Gantt configurations for reuse.

---

## Backplane Viewer

Scan the physical backplane of a connected PLC chassis to see every module slot.

- Shows module product name, device type, firmware revision, and serial number for every occupied slot.
- Status indicators: green for healthy, red for major fault, with fault descriptions.
- **L5X enrichment** — When an L5X file is loaded, the backplane viewer cross-references the live scan with the project configuration to show:
  - Catalog numbers for each module
  - Configured RPI (scan rate) in milliseconds
  - Connection type (rack-optimized, direct, etc.)
  - Electronic keying mode
  - Inhibited module status
  - I/O tag names mapped to each module with descriptions
  - Mismatches between the L5X configuration and the live hardware (e.g., a module configured in the project but missing from the chassis)
- Multi-chassis support with tabbed view when connected to multiple PLCs.

---

## Connection Options

- **RSLinx integration** — If RSLinx Classic is installed, RungTrace discovers all configured drivers and devices automatically. Select a device and connect in one click.
- **Manual connection** — Enter an IP address and slot number to connect directly over EtherNet/IP. No RSLinx required.
- **Favorites** — Save frequently-used PLC connections as named favorites for one-click access.
- **Multi-PLC** — Connect to multiple PLCs at the same time. All tools — watch list, plotting, Gantt, backplane viewer — work across all active connections.
- **Mock mode** — A built-in simulator for UI testing and demonstration without PLC hardware.

---

## Designed for the Plant Floor

- **Portable executable** — Single self-contained EXE. No installer, no runtime dependencies. Copy it to a USB drive and run it on any Windows 10/11 machine.
- **No Studio 5000 license required** — View and analyze PLC program logic from L5X exports without needing a Rockwell software license on the diagnostic machine.
- **No RSLinx OPC setup** — Communicates directly over EtherNet/IP using the CIP protocol. RSLinx is optional, not required.
- **Dark theme** — A clean, professional dark interface designed for extended use in control rooms and on the plant floor.
- **Diagnostic logging** — All operations are logged to daily log files for troubleshooting and audit trails.
- **Machine-locked licensing** — Cloud-verified license activation tied to the machine. Deactivate from one machine and reactivate on another as needed.
