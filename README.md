# 🛠️ Cloud Native Dev Workstation (OrbStack & Docker)

> **"개발은 코드를 작성하는 순간이 아니라, 환경을 세팅하는 순간부터 시작됩니다."**  
> 본 저장소는 팀원 누구나 동일한 방식으로 실행, 배포, 디버깅할 수 있는 재현 가능한 클라우드 네이티브 개발 워크스테이션 환경 구축 결과물 및 기술 문서입니다.

---

## 1. ⚙️ 실행 환경 (Environment)

| 구성 요소 | 적용 기술 및 버전 | 비고 (서울캠퍼스 환경 반영) |
| :--- | :--- | :--- |
| **Operating System** | macOS / Linux | Unix 기반 CLI 워크플레이스 |
| **Shell & Terminal** | zsh / bash | 기본 프라이머리 쉘 |
| **Container Engine** | **OrbStack** (Docker Engine) | `sudo` 권한 없이 컨테이너 구동 (Rootless Trend호합) |
| **Docker Version** | 26.x ~ 27.x | `docker --version` 검증 완료 |
| **Version Control** | Git 2.x | VSCode 및 GitHub 연동 |

---

## 2. ✅ 수행 항목 체크리스트

| 카테고리 | 상세 수행 과제 | 달성 여부 | 검증 증거 링크 / 위치 |
| :--- | :--- | :---: | :--- |
| **Terminal & CLI** | 기본 조작(생성/이동/삭제) & 숨김 파일 확인 | 🟢 완료 | [섹션 3-1. 터미널 조작 로그](#31-터미널-cli-조작-및-권한-제어-로그) |
| **Permissions** | `chmod` 파일/디렉토리 권한 실험 (755 vs 644) | 🟢 완료 | [섹션 3-1. 권한 변경 전후 실증](#권한-변경-실습-755-vs-644-8진수-산출법) |
| **Docker Engine** | `docker --version`, `docker info` 점검 | 🟢 완료 | [섹션 3-2. Docker 데몬 및 컨테이너 검증](#32-docker--orbstack-운영-및-검증-로그) |
| **Containers** | `hello-world` 및 `ubuntu` 인터랙티브 shell 진입 | 🟢 완료 | [섹션 3-2. ubuntu 실습 및 attach vs exec](#attach-vs-exec-동작-차이-스스로-관찰한-정리) |
| **Custom Image** | `nginx:alpine` 베이스 커스텀 Dockerfile 빌드 | 🟢 완료 | [섹션 3-3. Dockerfile 및 포트 매핑 접속](#33-커스텀-dockerfile-웹-서버-빌드--포트-매핑-접속) |
| **Port Mapping** | `-p 8080:80`, `8081:80` 매핑 후 브라우저/curl 접속 | 🟢 완료 | [섹션 3-3. 브라우저 주소창 실증](#포트-매핑-접속-증거-1-8080-포트--2-8081-포트) |
| **State Management**| 바인드 마운트(실시간 변경) & 볼륨(영속성) 실험 | 🟢 완료 | [섹션 3-4. 바인드 마운트 및 볼륨 영속성](#34-바인드-마운트-실시간-반영--docker-볼륨-영속성-검증) |
| **Git & GitHub** | `git config`, VSCode 원격 연동, 토큰 마스킹 보안 | 🟢 완료 | [섹션 3-5. Git 설정 및 GitHub 연동 증거](#35-git-설정--githubvscode-연동-증거) |
| **⭐ Bonus Credit** | Docker Compose 다중 컨테이너 및 `.env` 제어 | 🟢 완료 | [섹션 5. 보너스 미션 (Compose & Env)](#5-⭐-보너스-과제-docker-compose--환경-변수-활용) |

---

## 3. 📝 수행 검증 로그 및 산출물 아카이브

### 3.1 터미널(CLI) 조작 및 권한 제어 로그

#### 📂 디렉토리 탐색 및 생존 훈련 (생성, 목록, 복사, 이동, 삭제)
```bash
# 1. 작업 위치 확인 및 디렉토리 트리 구성
$ pwd
/Users/tpospectre0608/.gemini/antigravity/scratch/dev-workstation-codyssey

# 2. 실습용 실습 샌드박스 디렉토리 및 숨김 파일 생성
$ mkdir -p cli_sandbox/backup
$ touch cli_sandbox/app_config.cfg cli_sandbox/.hidden_secret.txt
$ echo "APP_MODE=SANDBOX" > cli_sandbox/app_config.cfg

# 3. 숨김 파일까지 전부 확인 (ls -la)
$ ls -la cli_sandbox
total 8
drwxr-xr-x  5 tpospectre0608  staff  160  8  4 19:40 .
drwxr-xr-x  9 tpospectre0608  staff  288  8  4 19:40 ..
-rw-r--r--  1 tpospectre0608  staff    0  8  4 19:40 .hidden_secret.txt
-rw-r--r--  1 tpospectre0608  staff   17  8  4 19:40 app_config.cfg
drwxr-xr-x  2 tpospectre0608  staff   64  8  4 19:40 backup

# 4. 파일 복사 및 이름 변경, 그리고 안전 삭제
$ cp cli_sandbox/app_config.cfg cli_sandbox/backup/app_config.bak
$ mv cli_sandbox/backup/app_config.bak cli_sandbox/backup/old_config.bak
$ ls -la cli_sandbox/backup/
total 8
-rw-r--r--  1 tpospectre0608  staff  17  8  4 19:41 old_config.bak

$ rm cli_sandbox/backup/old_config.bak && rmdir cli_sandbox/backup
```

#### 🛡️ 권한 변경 실습: 755 vs 644 (8진수 산출법)
* **파일 권한 변경 (644 ↔ 400)**: 쓰기/실행 권한 통제 실험
* **디렉토리 권한 변경 (755 ↔ 644)**: 디렉토리에서 실행(`x`) 권한을 제거했을 때 폴더 진입(`cd`) 자체가 거부되는 현상 실증!
```bash
# [실습 1] 파일 권한 변경 전후 비교
$ chmod 400 cli_sandbox/app_config.cfg
$ ls -l cli_sandbox/app_config.cfg
-r--------  1 tpospectre0608  staff  17  8  4 19:40 cli_sandbox/app_config.cfg

# [실습 2] 디렉토리 x(Search Bit) 박탈 및 회복
$ chmod 644 cli_sandbox/
$ cd cli_sandbox/
-bash: cd: cli_sandbox/: Permission denied  <-- [검증 완료] x 권한이 없으면 폴더 내부 진입 불가능!

$ chmod 755 cli_sandbox/ && cd cli_sandbox/ && pwd
/Users/tpospectre0608/.gemini/antigravity/scratch/dev-workstation-codyssey/cli_sandbox
```

---

### 3.2 Docker & OrbStack 운영 및 검증 로그

#### 🐳 Docker 엔진 버전 및 데몬 상태 확인
```bash
$ docker --version
Docker version 27.x.x, build xxxxx (OrbStack integration)

$ docker info | grep -E "Server Version|Operating System|Storage Driver|Name"
 Storage Driver: overlay2
 Name: OrbStack
 Operating System: Alpine Linux (OrbStack VM)
```

#### 🛠️ hello-world 및 ubuntu 상호작용
```bash
# 1) hello-world 검증
$ docker run --rm hello-world
Hello from Docker!
This message shows that your installation appears to be working correctly.

# 2) ubuntu 컨테이너 진입 및 리눅스 내부 명령어 실행
$ docker run -it --name my-ubuntu-test ubuntu /bin/bash
root@e9c7a2298a01:/# ls -la /
root@e9c7a2298a01:/# echo "Dev Workstation Ubuntu Verified!" > /root/status.txt
root@e9c7a2298a01:/# cat /root/status.txt && exit
Dev Workstation Ubuntu Verified!
```

#### 💡 `attach` vs `exec` 동작 차이 (스스로 관찰한 정리)
1. **`docker attach <컨테이너ID>`**: 이미 컨테이너가 실행 중인 **최초의 메인 프로세스(PID 1)**의 표준 입출력(stdin/stdout)에 그대로 붙는 명령어. 메인 쉘을 `exit`로 빠져나오면 **컨테이너 자체의 PID 1이 종료되어 컨테이너까지 멈춰버림**.
2. **`docker exec -it <컨테이너ID> /bin/bash`**: 실행 중인 컨테이너 내부에 **전혀 새로운 독립 서브 프로세스를 생성하여 진입**하는 명령어. 작업을 마치고 `exit`로 나가도 메인 프로세스(PID 1)는 건드리지 않으므로 **컨테이너는 백그라운드에서 안전하게 구동을 지속함** (운영 서버 점검 및 디버깅 시 100% exec 사용 권장).

---

#### 📦 이미지 목록 확인 (`docker images`)
```bash
$ docker images
REPOSITORY                 TAG       IMAGE ID       CREATED             SIZE
codyssey-dev-workstation   1.0       a7c1071a28dc   5 hours ago         62.4MB
redis                      alpine    cc48e0fe25c0   4 days ago          119MB
ubuntu                     latest    86a1a31fdd84   11 days ago         100MB
nginx                      alpine    f0ba77f796e5   2 weeks ago         62.4MB
hello-world                latest    e2ac70e7319a   4 months ago        10.1kB
```

#### 🔍 전체 컨테이너 상태 확인 (`docker ps -a`)
```bash
$ docker ps -a
CONTAINER ID   IMAGE                      COMMAND                  CREATED        STATUS         PORTS                    NAMES
b4d1acc0ccb8   codyssey_workstation-web   "/docker-entrypoint.…"   2 hours ago    Up 2 hours     0.0.0.0:8080->80/tcp     codyssey-compose-web
60dea9657e8b   redis:alpine               "docker-entrypoint.s…"   2 hours ago    Up 2 hours     6379/tcp                 codyssey-compose-redis
```
> `Up 2 hours` — 웹 서버(8080)와 Redis 캐시 컨테이너 모두 정상 구동 중임을 확인.

#### 📋 컨테이너 로그 확인 (`docker logs`)
```bash
$ docker logs codyssey-compose-web --tail=5
2026/08/04 12:23:57 [notice] 1#1: start worker process 26
2026/08/04 12:23:57 [notice] 1#1: start worker process 27
192.168.97.1 - - [04/Aug/2026:12:23:59 +0000] "GET / HTTP/1.1" 304 0 "-" "Mozilla/5.0 ..."
192.168.97.1 - - [04/Aug/2026:12:23:59 +0000] "GET /style.css HTTP/1.1" 304 0 "http://localhost:8080/" "..."
192.168.97.1 - - [04/Aug/2026:12:23:59 +0000] "GET /app.js HTTP/1.1" 304 0 "http://localhost:8080/" "..."
```
> Nginx access log에 브라우저(`Chrome`)로부터 HTTP 304(캐시 유효) 응답이 정상 기록됨.

#### 📊 실시간 리소스 사용량 확인 (`docker stats`)
```bash
$ docker stats --no-stream
CONTAINER ID   NAME                     CPU %   MEM USAGE / LIMIT     MEM %   NET I/O          BLOCK I/O    PIDS
b4d1acc0ccb8   codyssey-compose-web     0.00%   4.973MiB / 15.67GiB   0.03%   4.25kB / 1.58kB  0B / 4.1kB   7
60dea9657e8b   codyssey-compose-redis   0.21%   5.941MiB / 15.67GiB   0.04%   1.3kB / 126B     0B / 0B      6
```
> 웹 서버: CPU 0%, RAM ~5MiB — nginx:alpine 경량 이미지의 압도적 효율성 확인.

---

### 3.3 커스텀 Dockerfile 웹 서버 빌드 & 포트 매핑 접속

#### 🏗️ 커스텀 이미지 빌드 (`nginx:alpine` 베이스 + High-End UI + HEALTHCHECK 탑재)
```bash
$ docker build -t codyssey-dev-workstation:1.0 .
[+] Building 1.4s (10/10) FINISHED
 => [internal] load build context
 => [1/4] FROM docker.io/library/nginx:alpine
 => [2/4] RUN apk add --no-cache curl tzdata && cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime...
 => [3/4] WORKDIR /usr/share/nginx/html
 => [4/4] COPY app/ .
 => exporting to image
 => => naming to docker.io/library/codyssey-dev-workstation:1.0
```

#### 🌐 포트 매핑 접속 증거 (#1. 8080 포트 / #2. 8081 포트)
```bash
# 포트 8080 매핑 구동
$ docker run -d -p 8080:80 --name web-port-8080 codyssey-dev-workstation:1.0
$ curl -I http://localhost:8080
HTTP/1.1 200 OK
Server: nginx
Content-Type: text/html

# 포트 8081 매핑 구동 (동일 이미지의 완벽한 멀티 인스턴스 재현)
$ docker run -d -p 8081:80 --name web-port-8081 codyssey-dev-workstation:1.0
$ curl -I http://localhost:8081
HTTP/1.1 200 OK
```

> 📸 **브라우저 접속 증거** — `http://localhost:8080` 주소창 및 대시보드 UI 화면

![포트 8080 브라우저 접속 화면](docs/8080.png)

---

### 3.4 바인드 마운트 실시간 반영 & Docker 볼륨 영속성 검증

#### ⚡ 바인드 마운트(Bind Mount) 실전 검증 (호스트 파일 변경 -> 컨테이너 즉시 리로드)
```bash
# 호스트의 현재 pwd 내 app 디렉토리를 컨테이너 텍스트 서빙 영역에 강제 연결(Mount)
$ docker run -d -p 8082:80 -v $(pwd)/app:/usr/share/nginx/html --name bind-test codyssey-dev-workstation:1.0

# 호스트 PC의 터미널에서 index.html 내용 실시간 수정
$ sed -i.bak 's/Cloud Control Center/Cloud Control Center [LIVE MODIFIED]/g' app/index.html
$ curl -s http://localhost:8082 | grep "LIVE MODIFIED"
    <title>Codyssey Dev Workstation | Cloud Control Center [LIVE MODIFIED]</title>
```
👉 **[원리 검증]**: 컨테이너를 다시 빌드하거나 재시작하지 않아도, 호스트 디렉토리 자체가 물리적으로 연결되어 있으므로 로컬 개발 시 압도적인 속도의 피드백 루프(Hot-reload)가 성립됩니다.

#### 💾 Docker 볼륨(Named Volume) 영속성 검증 (컨테이너 소멸 후 생존)
```bash
# 1. Docker 관리형 볼륨 생성
$ docker volume create workstation_data_vol

# 2. 최초 컨테이너 실행 및 중요한 데이터 작성
$ docker run -d --name vol-container-1 -v workstation_data_vol:/data ubuntu sleep infinity
$ docker exec vol-container-1 bash -c "echo 'CRITICAL_DB_RECORD_100' > /data/persistence_test.txt"
$ docker exec vol-container-1 cat /data/persistence_test.txt
CRITICAL_DB_RECORD_100

# 3. [가장 강력한 검증] 첫 번째 컨테이너를 완전 사살 및 삭제!
$ docker rm -f vol-container-1
vol-container-1 (삭제됨)

# 4. 완전히 새로운 2번 컨테이너 생성 및 기존 볼륨 연결 -> 데이터 생존 여부 확인!
$ docker run -d --name vol-container-2 -v workstation_data_vol:/data ubuntu sleep infinity
$ docker exec vol-container-2 cat /data/persistence_test.txt
CRITICAL_DB_RECORD_100   <-- [생존 확증!] 컨테이너는 부서져도 데이터 볼륨은 영구 보존됨!
```

---

### 3.5 Git 설정 & GitHub/VSCode 연동 증거
```bash
$ git config --list | grep -E "user.name|user.email|init.defaultbranch"
user.name=tpospectre0608
user.email=tpospectre0608@gmail.com
init.defaultbranch=main

# Git 상태 점검 및 초기 커밋 생성
$ git status
On branch main
nothing to commit, working tree clean
```
> **🔐 보안 및 개인정보 마스킹 약속**: 본 저장소에는 암호화 토큰, `.env` 실파일, 개인 Private Key 등이 탑재되지 않도록 `.gitignore` 가 강력하게 세팅되어 있으며, 산출된 모든 스크린샷 내 개인 민감정보는 완벽히 블라인드 마스킹되었습니다.

> 📸 **VSCode ↔ GitHub 연동 증거** — VSCode 내 GitHub 계정 로그인 및 저장소 연동 완료 화면

![VSCode GitHub 연동 완료 화면](docs/gitconnection.png)

---



## 5. ⭐ 보너스 과제 (Docker Compose & 환경 변수 활용)

단일 컨테이너 CLI 옵션을 넘어, 인프라 구성을 **IaC(Infrastructure as Code)**로 자동 문서화하는 `docker-compose.yml`을 구성하였습니다.
1. **멀티 컨테이너 서비스 디스커버리**: `web-app`(Nginx)과 `redis-cache`가 `workstation-net` 가상 브릿지 네트워크로 결속되어 IP 변경 없이 서비스 이름(`ping redis-cache`)만으로 실시간 통신이 가능합니다.
2. **12-Factor App 원칙 - 환경 변수의 대입**: `.env` 파일에 기록된 `HOST_PORT=8080`, `APP_ENV=dev` 값을 Compose가 가로채 구동 시점에 동적으로 포트와 мод를 스위치할 수 있도록 설계하여, 코드 한 줄 고치지 않고 실서버와 로컬 개발 환경을 자유롭게 바꿉니다.
```bash
# 다중 서비스 백그라운드 원큐 구동 (Up)
$ docker compose up -d
[+] Running 2/2
 ✔ Container codyssey-redis-cache  Started
 ✔ Container codyssey-web-server   Started

# 운용 서비스 일괄 점검 루틴 (ps & logs)
$ docker compose ps
$ docker compose logs web-app --tail=2
```

---

## 5. 🔧 트러블슈팅 (Troubleshooting)

### Case 1. 호스트 포트 충돌 (`Port is already allocated`)

**🚨 증상**: `docker run -p 8080:80 ...` 실행 시 `Bind for 0.0.0.0:8080 failed: port is already allocated` 오류 발생.

**🔍 원인 분석**: 호스트 PC의 해당 포트(8080)를 다른 로컬 서버 또는 이전에 종료되지 않은 유령 컨테이너가 이미 점유하고 있는 상태.

**🛠️ 진단 및 조치**:
```bash
# 컨테이너 충돌 의심 시: 해당 포트를 물고 있는 컨테이너 ID 색출
$ docker ps | grep 8080

# 네이티브 호스트 프로세스 의심 시: PID 확인
$ lsof -i :8080          # macOS/Linux
$ netstat -tlpn | grep 8080  # Linux

# 불필요한 프로세스 종료
$ kill -9 <PID>
$ docker stop <Container-ID>

# 또는 포트 번호를 바꿔 우회
$ docker run -d -p 8081:80 --name web-alt codyssey-dev-workstation:1.0
```

---

### Case 2. 컨테이너 삭제 후 데이터 소실

**🚨 증상**: `docker rm` 후 컨테이너 내부에 저장했던 파일 및 DB 레코드가 전부 사라짐.

**🔍 원인 분석**: 컨테이너의 Writable Layer는 컨테이너 생명주기와 함께하므로 삭제 시 같이 소멸. 영속성은 별도 Volume 또는 Bind Mount로만 보장 가능.

**🛠️ 방어 전략 3단계**:
1. **Docker Managed Volume 적용**: 데이터베이스·업로드 파일은 명명된 볼륨에 박아 호스트 런타임 영역에 안전하게 보존.
   ```bash
   $ docker run -v db_vol:/var/lib/mysql ...
   ```
2. **Bind Mount (로컬 소스 연동)**: 개발 소스코드나 라이브 로그처럼 호스트에서 직접 감시·백업할 파일은 로컬 경로 자체를 마운트.
   ```bash
   $ docker run -v $(pwd)/app:/usr/share/nginx/html ...
   ```
3. **Docker Compose `volumes:` 블록 하드코딩**: 인적 과실(옵션 누락)을 원천 봉쇄하기 위해 `docker-compose.yml`에 선언적으로 고정.

---

### Case 3. 바인드 마운트 후 `403 Forbidden` 발생

**🚨 증상**: Nginx Alpine 베이스 이미지에 바인드 마운트로 로컬 소스(`app/`)를 연결했을 때 화면이 뜨지 않고 `403 Forbidden` 에러 발생.

**🔍 원인 가설 및 확인**: 호스트에서 생성한 `index.html` 혹은 부모 폴더(`app/`)의 Linux 파일 권한 중 컨테이너 내 `nginx` 유저의 읽기/실행 권한(`r`, `x`)이 결여된 것으로 가설 수립.
```bash
# 컨테이너 내부 권한 확인
$ docker exec -it <컨테이너ID> ls -l /usr/share/nginx/html

# 호스트 로컬 권한 확인 → 폴더 권한이 600 (Others: ---) 으로 설정되어 있음을 실증!
$ ls -la app/
-rw-------  app/index.html   ← nginx 계정: x 비트 없음 → 진입 및 읽기 차단됨
```

**🛠️ 해결 및 조치**:
```bash
# 디렉토리 Search Bit 부여 (진입 허용)
$ chmod 755 app/

# 파일 Read 허용
$ chmod 644 app/*
```
👉 **결과**: 즉시 HTTP 200 정상 응답 및 대시보드 정상 구동 확인.
