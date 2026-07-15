#!/bin/bash
sed -i '716a \  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);' App.tsx
