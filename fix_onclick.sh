#!/bin/bash
awk '
  /onClick=\{\(\) => \{/ {
    if (in_reset) {
      print "                    onClick={() => {"
      print "                      setShowResetConfirm(true);"
      in_reset = 0
      skip = 1
      next
    }
  }
  /text-\[#d93838\]/ {
    in_reset = 1
  }
  skip && /}\}/ { skip = 0; print "                    }}"; next }
  skip { next }
  {print}
' App.tsx > App_temp3.tsx
mv App_temp3.tsx App.tsx
