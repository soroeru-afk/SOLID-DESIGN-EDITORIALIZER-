#!/bin/bash
awk '
  /{[/][*] Bottom info text removed/ {
    while ((getline line < "append_modal.txt") > 0) {
      print line
    }
  }
  {print}
' App.tsx > App_temp.tsx
mv App_temp.tsx App.tsx
