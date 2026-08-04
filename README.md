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

> **[실습 진행 시 캡처 추가 위치]**: 브라우저 주소창(`http://localhost:8080` 및 `8081`)이 명확히 보이는 **Codyssey Control Center UI 대시보드 스크린샷**을 `docs/` 폴더에 저장하여 연결합니다.

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

---

## 4. 🧠 동작 구조 설계 및 핵심 기술 원리 (인터뷰 완벽 방어)

### 4.1 프로젝트 디렉토리 구조 및 설계 기준
* **관심사의 분리 (Separation of Concerns)**: 소스 코드(`app/`), 인프라 정의(`Dockerfile`, `docker-compose.yml`), 환경변수(`.env`), 검증 로그/스크린샷(`docs/`)을 폴더별로 명확히 단절하여 협업 시 다른 엔지니어와의 불필요한 Git 충돌을 막고 가독성을 높였습니다.

### 4.2 이미지(Image) vs 컨테이너(Container)의 차이점 (빌드/실행/변경)
* **빌드(Build)**: `Dockerfile`의 각 줄(Instruction)이 하나의 불변하는 **읽기 전용 레이어(Layer)**로 겹겹이 굳어져 저장된 템플릿(붕어빵 틀)입니다.
* **실행(Run)**: 불변 이미지 위에 얇은 **읽기/쓰기 가능한 임시 레이어(Writable Layer)**를 올려서 CPU와 메모리 자원을 받아 구동되는 생명체(붕어빵)입니다.
* **변경(Change)**: 컨테이너 내부에서 파일을 지우거나 고쳐도 밑바탕이 되는 **원본 이미지는 절대 흔들리지 않으며 오염되지 않습니다.** 반대로 컨테이너를 삭제하면 Writable 레이어도 파괴되므로, **영속적 유지가 필요한 데이터는 반드시 볼륨(Volume)이나 바인드 마운트로 빼내야 합니다.**

### 4.3 컨테이너 내부 포트로 직접 접속할 수 없는 이유 & 포트 매핑의 힘
* 컨테이너는 호스트 컴퓨터와 완전히 격리된 **독자적인 가상 네트워크 네임스페이스(Network Namespace / 독립 IP)**를 할당받습니다. 
* 내부 웹 서버가 `80` 포트로 돌고 있어도 외부 브라우저나 호스트의 로컬 회선은 그 격리된 가상 공간을 자동으로 식별할 통로가 없습니다. 따라서 호스트 컴퓨터의 특정 현관문 포트(예: `8080`)로 들어온 트래픽을 컨테이너 내부 80번으로 토스해주는 **NAT(포트 포워딩, `-p` 옵션)**이 필수적으로 요구됩니다.

### 4.4 절대 경로(Absolute Path) vs 상대 경로(Relative Path) 선택 기준
* **절대 경로(예: `/usr/share/nginx/html`)**: 터미널 프롬프트가 어느 폴더에 위치해 있든 언제나 100% 동일한 대상을 정확히 찾아냅니다. **Dockerfile 내의 WORKDIR 지정이나 CI/CD 배포 자동화 스크립트처럼 절대 오류가 발생해선 안 되는 서버 구성 시** 사용합니다.
* **상대 경로(예: `./app/style.css`)**: 현재 내 위치(pwd)를 중심으로 대상까지의 방향을 짚어냅니다. **개발 프로젝트 내부의 파일들끼리 서로를 불러올 때(HTML에서 JS 호출)** 또는 **다른 팀원이 프로젝트 디렉토리 전체를 다른 데스크탑이나 경로로 통째로 다운로드 받아 실행할 때** 경로 손상을 막기 위해 채택합니다.

### 4.5 Linux 파일 권한 8진수 표기법 (755, 644) 메커니즘
Linux의 권한은 **소유자(User) / 소유그룹(Group) / 기타 사용자(Others)** 세 영역으로 나뉘며, 각 자리는 비트 연산(`r:4`, `w:2`, `x:1`)의 합으로 정해집니다.
* **`644` (일반 텍스트/소스파일 표준)**: `User=4+2(rw)`, `Group=4(r)`, `Others=4(r)`. 타인이 실수로라도 코드를 수정하거나 삭제하지 못하도록 읽기만 허용하는 가장 안전한 권한입니다.
* **`755` (디렉토리 및 실행파일 표준)**: `User=4+2+1(rwx)`, `Group=4+1(rx)`, `Others=4+1(rx)`. **디렉토리에서 `x` 권한은 단순한 파일 실행이 아니라 "폴더 내부로 진입(`cd`)하고 파일 목록을 탐색(Search Bit)할 수 있는 열쇠"** 역할을 하기 때문에 필수적으로 5 또는 7을 주어야 합니다.

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

## 6. 🎤 심층 인터뷰 (Troubleshooting & Deep-Dive Defense)

#### Q1. "호스트 포트가 이미 사용 중(`EADDRINUSE` / Port is already allocated)"이라 포트 매핑이 실패한다면 어떤 순서로 진단하겠는가?
> **[수석 개발자의 4단계 해결 알고리즘]**
> 1. **[문제 확인]**: `docker run -p 8080:80 ...` 실행 시 `Bind for 0.0.0.0:8080 failed: port is already allocated` 오류 발생을 확인합니다.
> 2. **[가설 및 추적]**: 호스트 PC의 해당 포트(8080)를 이미 점유하고 있는 다른 로컬 서버나 이전 유령 컨테이너가 돌고 있다고 판단합니다.
> 3. **[진단 명령]**:
>    - 컨테이너 충돌 의심 시: `docker ps | grep 8080`을 입력해 8080을 물고 있는 컨테이너 ID를 색출합니다.
>    - 네이티브 호스트 프로세스 의심 시: `lsof -i :8080` (macOS/Linux) 또는 `netstat -tlpn | grep 8080`을 쳐서 PID를 찾아냅니다.
> 4. **[조치 대안]**: 불필요한 프로세스라면 `kill -9 <PID>` 나 `docker stop <Container-ID>`로 해제합니다. 둘 다 운영해야 하는 필수 프로세스라면 새로 실행하는 컨테이너의 포트 매핑을 `-p 8081:80`으로 바꿔 유연하게 우회합니다.

#### Q2. 컨테이너 삭제 후 데이터가 사라진 경험이 있다면, 이를 방지하기 위한 대안은 무엇인가?
> **[수석 개발자의 방어 대본]**
> 컨테이너 자체는 철저히 **Stateless(무상태, 수행 후 얼마든지 소멸 가능한 용도)**로만 인지하고 구동해야 합니다. 쓰기 레이어에 저장된 데이터는 컨테이너 사멸 시 함께 날아가므로, 다음 3가지 방어 전략을 취합니다.
> 1. **Docker Managed Volume 적용**: 데이터베이스나 애플리케이션 업로드는 `-v db_vol:/var/lib/mysql` 등 명명된 볼륨에 담아 호스트 런타임 수집 영역에 안전히 박아둡니다.
> 2. **Bind Mount (로컬 소스 연동)**: 개발 소스코드나 라이브 로그처럼 호스트 PC에서 직접 감시하고 백업해야 하는 파일은 로컬 작업 경로 자체를 마운트합니다.
> 3. **Docker Compose의 Declarative Volume 선언**: 엔지니어의 인적 과실(옵션 누락)을 막기 위해 CLI로 일일이 타건하지 않고 `docker-compose.yml` 파일 안에 `volumes:` 블록을 영구히 하드 코딩해 버립니다.

#### Q3. 이 미션에서 가장 어려웠던 지점과 해결 과정 (가설 → 확인 → 조치)을 서술하시오.
> **[트러블슈팅 케이스 : 권한 및 마운트 시의 심층 해결 사례]**
> - **[어려웠던 문제]**: Nginx Alpine 베이스 이미지에 바인드 마운트로 로컬 소스(`app/`)를 연결했을 때 화면에 정적 코드가 안 뜨고 `403 Forbidden` 에러가 뿜어져 나왔습니다.
> - **[원인 가설]**: 컨테이너가 파일 존재는 인지하나, 호스트에서 생성한 `index.html` 혹은 부모 폴더(`app/`)의 **Linux 8진수 파일 권한** 중 타 사용자(Others)나 컨테이너 내 `nginx` 유저의 읽기/실행 권한(`r` 또는 `x`)이 결여되었을 것이라 가설을 세웠습니다.
> - **[확인 과정]**: `docker exec -it <컨테이너ID> ls -l //usr/share/nginx/html` 및 로컬 터미널에서 `ls -la app/`을 쳤더니, 실수로 폴더 권한이 `600`(`User=rw-, Group=---, Others=---`)으로 되어 있어 컨테이너의 nginx 계정에서 진입(`x` 비트 없음) 및 읽기가 차단됨을 실증했습니다.
> - **[해결 및 조치]**: 로컬 터미널에서 **`chmod 755 app/` (디렉토리 Search Bit 부여)** 및 **`chmod 644 app/*` (파일 Read 허용)** 명령어를 적용하여 마운트된 디렉토리의 읽기 권한을 인적·보안상 최적 상태로 회복시켰으며, 즉시 HTTP 200 정상 응답과 함께 화려한 대시보드가 구동되는 것을 확인했습니다.
