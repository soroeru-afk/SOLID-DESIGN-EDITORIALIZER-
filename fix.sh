#!/bin/bash
# Remove everything from line 2089 down to the end of the global settings block and replace it cleanly.
sed -i '2089,2117d' App.tsx
