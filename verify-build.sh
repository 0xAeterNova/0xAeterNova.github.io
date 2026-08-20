#!/usr/bin/env bash
echo -e "\033[0;36m[0xAeterNova] Verifying Build Integrity...\033[0m"
cat ./BUILD-ID.txt
echo -e "\n\033[0;33m[Git Working Tree Status]:\033[0m"
git status --short
