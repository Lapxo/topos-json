# @lapxo/topos-json

![version 0.1.1](https://img.shields.io/badge/version-0.1.1-8c959f) ![license MIT](https://img.shields.io/badge/license-MIT-8c959f) ![node >=22.12](https://img.shields.io/badge/node-%3E%3D22.12-8c959f) ![dependencies 1](https://img.shields.io/badge/dependencies-1-8c959f) ![cases 0 hold](https://img.shields.io/badge/cases-0_hold-8c959f) ![verify agrees](https://img.shields.io/badge/verify-agrees-2da44e)

A document says what it holds.

Point a JSON document at it and it reads what the document says of itself, and the names the document cites. [its regions, read off its own descriptor](docs/reference.md)

## Why two readings

A document says what it holds, and it cites the names it is built from. Both readings are the same document.

## One document, two readings

<p align="center"><img src="docs/img/world.svg" alt="declares , runs on , reaches, 2 regions, the longest of them 0 lines, 0 vector files, each held from the blob, pinned by topos-json and run by the host" width="640"></p>

## What it claims

- **It costs 1 dependencies: the SDK it answers through.** · [receipt](receipts.bound)

## Line

Add to your lock:
sources/topos-json value=github:Lapxo/topos-json
uses/topos-json sha256:<release digest>
Fetch the release asset, verify its sha256 equals the uses/ line, place it in bound/cas/blobs/. Fold: its pages appear.
open: line/install needs=host/resolve — when bound resolves sources/ itself, the fetch line leaves the page by fold.

It rests on topos.

## Check

● 0 cases hold

● `npm ci && npm run build`
