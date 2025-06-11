#!/bin/zsh
PROJECT="/Users/imac2019/My-Apps/Computer123-Project/Ver02"
cd "$PROJECT" || exit 1

# اگر قفل قدیمی مانده، حذف کن
[ -f .git/index.lock ] && rm -f .git/index.lock

# اگر تغییری هست، کامیت و پوش
if ! git diff --quiet ; then
  git add -A
  git commit -m "auto: $(date '+%Y-%m-%d %H:%M')"
  git push origin main
fi
