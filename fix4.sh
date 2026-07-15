#!/bin/bash
sed -i '2108d' App.tsx
sed -i '2115 s/$/ >/' App.tsx
