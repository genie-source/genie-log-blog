---
title: Linux 서버 처음 세팅할 때 반드시 하는 것들
date: 2025-03-15
category: Server
description: UFW, SSH 키 인증, 자동 보안 업데이트 — 새 서버 뜰 때마다 하는 기본 체크리스트
readTime: 5분
---

새 서버를 받을 때마다 매번 찾아보는 것들을 한 번에 정리해봤습니다. Ubuntu 기준입니다.

## SSH 키 인증으로 바꾸기

비밀번호 인증을 끄고 키 인증만 허용합니다.

```bash
# 로컬에서 키 생성
ssh-keygen -t ed25519 -C "genie@server"

# 서버에 공개키 복사
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server-ip
```

그 다음 `/etc/ssh/sshd_config`에서 아래 항목을 수정합니다.

```
PasswordAuthentication no
PubkeyAuthentication yes
```

## UFW 방화벽 설정

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

> ⚠️ `ufw enable` 전에 SSH 포트를 열었는지 반드시 확인하세요. 안 그러면 잠깁니다.

## 자동 보안 업데이트

```bash
apt install unattended-upgrades
dpkg-reconfigure --priority=low unattended-upgrades
```

## 체크리스트 요약

- SSH 키 인증 설정 완료
- 비밀번호 인증 비활성화
- UFW 방화벽 활성화
- 자동 보안 업데이트 설정
- 루트 로그인 비활성화 (`PermitRootLogin no`)
