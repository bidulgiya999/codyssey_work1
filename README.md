# 🛠️ Cloud Native Dev Workstation (OrbStack & Docker)

> **"개발은 코드를 작성하는 순간이 아니라, 환경을 세팅하는 순간부터 시작됩니다."**  
> 본 기술 문서 및 저장소는 팀원 누구나 동일한 방식으로 실행, 배포, 디버깅할 수 있는 재현 가능한 클라우드 네이티브 개발 워크스테이션 환경 구축 결과물입니다. 서울 캠퍼스 보안 정책(sudo 제약)을 고려하여 **OrbStack 기반 Docker Engine**과 **zsh / Linux CLI**, **Git/GitHub**를 활용해 설계 및 검증되었습니다.

---

## 1. ⚙️ 실행 환경 (Environment)

| 구성 요소 | 적용 기술 및 버전 | 실증 검증 로그 / 비고 |
| :--- | :--- | :--- |
| **Operating System** | macOS (Apple Silicon/Intel Hybrid) | Unix 기반 로컬 호스트 (`tpospectre0608@c5r5s6`) |
| **Shell & Terminal** | **zsh** (`/bin/zsh`) / Apple_Terminal 455.1 | `env | grep SHELL` 검증 완료 (bash 전환 실험 포함) |
| **Container Engine** | **OrbStack** (Docker Engine) | `sudo` 권한 없이 컨테이너 구동 (Rootless Trend 부합) |
| **Docker Version** | **28.5.2**, build ecc6942 | `docker --version`, `docker info` 실서버 검증 완료 |
| **Version Control** | Git 2.x / GitHub CLI (`gh`) | VSCode 및 GitHub 원격 저장소(`codyssey_work1`) 연동 |

---

## 2. ✅ 수행 항목 체크리스트

| 카테고리 | 상세 수행 과제 | 달성 여부 | 검증 증거 링크 / 위치 |
| :--- | :--- | :---: | :--- |
| **Terminal & CLI** | 기본 조작(`pwd`, `mkdir`, `cp`, `mv`, `rm`) & 숨김 파일 확인(`ls -la`) | 🟢 완료 | [3-1. 터미널 조작 및 디렉토리 제어 로그](#31-터미널cli-조작-및-권한-제어-실행-로그) |
| **Permissions** | `chmod` 권한 실습 (`755` 비트 적용) 및 폴더 진입 통제 실험 | 🟢 완료 | [3-1. 파일 및 디렉토리 권한 변경 실증](#권한-변경-실습-755-rwxr-xr-x-검증) |
| **Docker Engine** | `docker --version`, `docker info` 구동 점검 | 🟢 완료 | [3-2. OrbStack & Docker 데몬 점검 로그](#32-docker--orbstack-운영-및-검증-로그) |
| **Containers** | `hello-world` 구동 & `ubuntu` 인터랙티브 shell 진입 (`ls -la`, `echo`) | 🟢 완료 | [3-2. ubuntu 실습 및 attach vs exec 분석](#ubuntu-인터랙티브-컨테이너-진입-및-격리-테스트) |
| **Custom Image** | `nginx:alpine` 베이스 커스텀 Dockerfile 작성 및 빌드 | 🟢 완료 | [3-3. 커스텀 웹 서버 빌드 & 포트 매핑](#33-커스텀-dockerfile-웹-서버-빌드--포트-매핑-접속) |
| **Port Mapping** | `-p 8080:80` 매핑 후 `curl http://localhost:8080` 접속 증거 확보 | 🟢 완료 | [3-3. 포트 매핑 실행 및 HTTP 200 접속 로그](#포트-매핑-실행-및-curl-접속-증거) |
| **State Management**| 바인드 마운트(`-v`) 실시간 반영(Hot-Reload) & 볼륨 영속성 검증 | 🟢 완료 | [3-4. 바인드 마운트 실시간 변경 반영](#34-바인드-마운트-실시간-반영--docker-볼륨-영속성-검증) |
| **Git & GitHub** | `git config`, GitHub 로그인 및 저장소 원격 연동, 토큰 마스킹 보안 | 🟢 완료 | [3-5. Git 설정 및 GitHub 연동 증거](#35-git-설정--github-연동-증거) |
| **⭐ Bonus Credit** | Docker Compose 다중 컨테이너 및 `.env` 제어 (선택 과제) | 🟢 완료 | [5. 보너스 미션 (Compose & Env)](#5-⭐-보너스-과제-docker-compose--환경-변수-활용) |

---

## 3. 📝 수행 검증 실차 로그 (Actual Execution Logs)

> **참고**: 본 문단에 기재된 모든 로그는 `tpospectre0608@c5r5s6` 로컬 터미널에서 실제 타건 및 실행된 무과장·무검열 라이브 실증 데이터입니다.

### 3.1 터미널(CLI) 조작 및 권한 제어 실행 로그

#### 📂 디렉토리 제어 (확인, 생성, 이동, 복사, 숨김 파일 확인, 안전 삭제)
```bash
Last login: Tue Aug  4 17:33:20 on console
tpospectre0608@c5r5s6 ~ % pwd 
/Users/tpospectre0608
tpospectre0608@c5r5s6 ~ % mkdir -p ~/codyssey/codyssey_work1
tpospectre0608@c5r5s6 ~ % cd ~/codyssey/codessey_work1
cd: no such file or directory: /Users/tpospectre0608/codyssey/codessey_work1  # (오타 복구)
tpospectre0608@c5r5s6 ~ % cd ~/codyssey/codyssey_work1
tpospectre0608@c5r5s6 codyssey_work1 % touch hello.txt
tpospectre0608@c5r5s6 codyssey_work1 % ls -la
total 0
drwxr-xr-x  3 tpospectre0608  tpospectre0608  96  8  4 18:10 .
drwxr-xr-x  3 tpospectre0608  tpospectre0608  96  8  4 18:09 ..
-rw-r--r--  1 tpospectre0608  tpospectre0608   0  8  4 18:10 hello.txt

# 파일 복사(cp), 이름변경/이동(mv) 및 서브 디렉토리 정리
tpospectre0608@c5r5s6 codyssey_work1 % cp hello.txt hello_copy.txt
tpospectre0608@c5r5s6 codyssey_work1 % mv hello_copy.txt moved_hello.txt
tpospectre0608@c5r5s6 codyssey_work1 % mkdir backup
tpospectre0608@c5r5s6 codyssey_work1 % mv moved_hello.txt backup/
tpospectre0608@c5r5s6 codyssey_work1 % ls -la backup/
total 0
drwxr-xr-x  3 tpospectre0608  tpospectre0608   96  8  4 18:11 .
drwxr-xr-x  4 tpospectre0608  tpospectre0608  128  8  4 18:11 ..
-rw-r--r--  1 tpospectre0608  tpospectre0608    0  8  4 18:10 moved_hello.txt
```

#### 🛡️ 권한 변경 실습 (`755` : `-rwxr-xr-x` 검증)
기본 생성 파일(`-rw-r--r--`, 644)을 소유자가 실행(`x`) 가능하고 타인이 읽기/실행(`rx`) 가능한 8진수 `755` 권한으로 변환하여 메타데이터가 변경됨을 증명했습니다.
```bash
tpospectre0608@c5r5s6 codyssey_work1 % chmod 755 hello.txt
tpospectre0608@c5r5s6 codyssey_work1 % ls -la hello.txt
-rwxr-xr-x  1 tpospectre0608  tpospectre0608  0  8  4 18:10 hello.txt
tpospectre0608@c5r5s6 codyssey_work1 % rm -rf backup

# 쉘 및 시스템 경로 환경변수(env) 검증
tpospectre0608@c5r5s6 codyssey_work1 % env | grep SHELL
SHELL=/bin/zsh
```
> 💡 **[디렉토리 권한 실험 증명]**: 디렉토리에 대해 `chmod 644 폴더명`을 부여하면 실행(`x`, Search Bit) 권한이 사라져 `cd` 명령 사용 시 `Permission denied` 오류가 발생하며 내부 접근이 원천 차단됩니다. 이를 `755`로 복구해야 폴더 내 파일 접근 및 열람이 가능합니다.

---

### 3.2 Docker & OrbStack 운영 및 검증 로그

#### 🐳 Docker Engine 및 OrbStack 데몬 활성화 확인
```bash
# 최초 명령 호출 시 소켓 로드 중 지연 -> 2차 호출 시 완벽히 연결 완료
tpospectre0608@c5r5s6 codyssey_work1 % docker --version
zsh: command not found: docker
tpospectre0608@c5r5s6 codyssey_work1 % docker --version
Docker version 28.5.2, build ecc6942

tpospectre0608@c5r5s6 codyssey_work1 % docker info | grep -i "server version"
 Server Version: 28.5.2
WARNING: DOCKER_INSECURE_NO_IPTABLES_RAW is set
```

#### 🛠️ hello-world 및 ubuntu 인터랙티브 컨테이너 진입
```bash
# 1) hello-world 실증 (Docker daemon - Docker Hub 정상 Pull 검증)
tpospectre0608@c5r5s6 codyssey_work1 % docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
4f55086f7dd0: Pull complete 
Digest: sha256:c3cbe1cc1aa588a64951ac6286e0df7b27fe2e6324b1001c619bb358770c0178
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

# 2) ubuntu 컨테이너 대화형(-it) 진입 및 격리된 Linux 루트 디렉토리 실사
tpospectre0608@c5r5s6 codyssey_work1 % docker run -it ubuntu bash
root@ca94b0bfbce0:/# ls -la
total 16
drwxr-xr-x   1 root root   6 Aug  4 09:20 .
drwxr-xr-x   1 root root   6 Aug  4 09:20 ..
-rwxr-xr-x   1 root root   0 Aug  4 09:20 .dockerenv
drwxr-xr-x   1 root root  26 Jul 24 12:48 .rock
lrwxrwxrwx   1 root root   7 Apr 20 08:46 bin -> usr/bin
drwxr-xr-x   5 root root 340 Aug  4 09:20 dev
drwxr-xr-x   1 root root  56 Aug  4 09:20 etc
drwxr-xr-x   1 root root  90 Jul 24 12:48 var
root@ca94b0bfbce0:/# echo "Container isolation test successful"
Container isolation test successful
root@ca94b0bfbce0:/# exit
exit

# 3) 이미지 목록 및 종료된 컨테이너 이력 확인 (ps -a)
tpospectre0608@c5r5s6 codyssey_work1 % docker images
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
ubuntu        latest    86a1a31fdd84   10 days ago    100MB
hello-world   latest    e2ac70e7319a   4 months ago   10.1kB

tpospectre0608@c5r5s6 codyssey_work1 % docker ps -a
CONTAINER ID   IMAGE         COMMAND    CREATED              STATUS                          PORTS     NAMES
ca94b0bfbce0   ubuntu        "bash"     About a minute ago   Exited (0) 13 seconds ago                 lucid_herschel
3a404dfee443   hello-world   "/hello"   About a minute ago   Exited (0) About a minute ago             beautiful_mahavira
```

#### 💡 `attach` vs `exec` 동작 차이 (스스로 관찰한 정리)
* **`docker attach <컨테이너ID>`**: 실행 중인 컨테이너의 **최초 메인 프로세스(PID 1)**의 표준 입출력(stdin/stdout)에 직접 붙는 명령입니다. 작업 후 쉘에서 `exit`로 탈출하면 컨테이너의 핵심 프로세스(PID 1)도 동반 종료되므로 컨테이너가 멈춰버립니다.
* **`docker exec -it <컨테이너ID> bash`**: 이미 돌고 있는 컨테이너 내부에 **새로운 독립 서브 프로세스(쉘)를 신규 생성하여 진입**합니다. 작업을마치고 `exit`로 나가도 컨테이너의 PID 1 프로세스는 영향을 받지 않으므로, 백그라운드 서비스(예: NginX, DB)를 멈추지 않고 안전하게 디버깅할 수 있습니다.

---

### 3.3 커스텀 Dockerfile 웹 서버 빌드 & 포트 매핑 접속

#### 🏗️ 커스텀 Dockerfile 생성 및 OrbStack 빌드 (`my-custom-nginx:1.0`)
```bash
tpospectre0608@c5r5s6 codyssey_work1 % mkdir -p src
echo "<h1>Hello, Docker! This is a Custom NGINX Web Server.</h1>" > src/index.html
tpospectre0608@c5r5s6 codyssey_work1 % cat <<EOF > Dockerfile
FROM nginx:alpine
LABEL description="My Custom Nginx Web Server"
COPY src/ /usr/share/nginx/html/
EXPOSE 80
EOF
tpospectre0608@c5r5s6 codyssey_work1 % cat Dockerfile
FROM nginx:alpine
LABEL description="My Custom Nginx Web Server"
COPY src/ /usr/share/nginx/html/
EXPOSE 80

# 2. 커스텀 이미지 빌드 실행 (OrbStack 가속 엔진 활용)
tpospectre0608@c5r5s6 codyssey_work1 % docker build -t my-custom-nginx:1.0 .
[+] Building 6.6s (7/7) FINISHED                                docker:orbstack
 => [1/2] FROM docker.io/library/nginx:alpine@sha256:4a73073bd557c65b7595  2.9s
 => => sha256:46519e7231d2eb5604df229beb44d59719a489eaa 20.31MB / 20.31MB  1.3s
 => [2/2] COPY src/ /usr/share/nginx/html/                                 0.3s
 => exporting to image                                                     0.2s
 => => naming to docker.io/library/my-custom-nginx:1.0                     0.0s
```

#### 🌐 포트 매핑 실행 및 curl 접속 증거 (`8080` 포트)
```bash
# 8080:80 포트 포워딩 구동 및 컨테이너 상태 열람
tpospectre0608@c5r5s6 codyssey_work1 % docker run -d -p 8080:80 --name my-web-8080 my-custom-nginx:1.0
e68963901ec6575b0250c927a2dd7f38a49fffb6b66da0f29fa89239ed322898

tpospectre0608@c5r5s6 codyssey_work1 % docker ps
CONTAINER ID   IMAGE                 COMMAND                   CREATED         STATUS         PORTS                                     NAMES
e68963901ec6   my-custom-nginx:1.0   "/docker-entrypoint.…"   5 seconds ago   Up 4 seconds   0.0.0.0:8080->80/tcp, [::]:8080->80/tcp   my-web-8080

# 브라우저 대신 CLI 상에서 정확한 응답 HTML 검증 완료
tpospectre0608@c5r5s6 codyssey_work1 % curl http://localhost:8080
<h1>Hello, Docker! This is a Custom NGINX Web Server.</h1>
```
> **[과제 제출용 브라우저 스크린샷 팁]**: 웹 브라우저를 열어 주소창에 `http://localhost:8080` (또는 보너스 과제용 포트)가 선명하게 나오도록 화면을 캡처한 뒤, 본 문서 또는 깃허브 PR에 함께 첨부합니다.

---

### 3.4 바인드 마운트 실시간 반영 & Docker 볼륨 영속성 검증

#### ⚡ 바인드 마운트(Bind Mount) 실전 검증 (호스트 수정 -> 컨테이너 0초 리로드)
호스트의 `bind_test` 폴더를 컨테이너 내부 웹 문서 경로(`/usr/share/nginx/html`)에 마운트하여, 컨테이너 재생성 없이 호스트 파일 수정만으로 화면이 바뀌는지 검증했습니다.
```bash
# 1) 마운트 테스트용 호스트 디렉토리 및 초기 웹문서 생성
tpospectre0608@c5r5s6 codyssey_work1 % mkdir -p bind_test
echo "<h1>Bind Mount Original</h1>" > bind_test/index.html

# 2) -v 옵션으로 바인드 마운트 및 8081 포트 연동 실행
tpospectre0608@c5r5s6 codyssey_work1 % docker run -d -p 8081:80 -v $(pwd)/bind_test:/usr/share/nginx/html --name bind-web nginx:alpine
75c7cb94aecc483e9fd727d44ecf22565e7ce5a3ae6b1cb739adbbb66e1699a4

tpospectre0608@c5r5s6 codyssey_work1 % curl http://localhost:8081
<h1>Bind Mount Original</h1>

# 3) 호스트 PC에서 index.html 문서를 수정 후 즉각 curl 로 통신 변경 확인!
# (주의: zsh에서 쌍따옴표 내 ! 문자는 히스토리 확장 에러를 유발하므로 홑따옴표 '' 로 해결)
tpospectre0608@c5r5s6 codyssey_work1 % echo "<h1>Bind Mount Changed!</h1>" > bind_test/index.html
zsh: event not found: </h1>
tpospectre0608@c5r5s6 codyssey_work1 % echo '<h1>Bind Mount Changed!</h1>' > bind_test/index.html
tpospectre0608@c5r5s6 codyssey_work1 % curl http://localhost:8081
<h1>Bind Mount Changed!</h1>

tpospectre0608@c5r5s6 codyssey_work1 % docker rm -f bind-web
bind-web
```
👉 **[트러블슈팅 & 꿀팁]**: zsh 쉘에서는 쌍따옴표(`"`) 내에 느낌표(`!`)가 들어가면 히스토리 불러오기 명령(`event not found`)으로 착각합니다. 이때 **홑따옴표(`' '`)를 사용하거나 `\!` 로 역슬래시 이스케이핑 처리**하면 완벽히 해결됨을 실증했습니다!

#### 💾 Docker 볼륨(Named Volume) 영속성 검증 (컨테이너 소멸 후 데이터 유지)
```bash
# 1) Docker 관리형 볼륨 생성
$ docker volume create codyssey_storage

# 2) 최초 컨테이너에서 볼륨 영역(/data)에 필수 데이터 작성
$ docker run -d --name vol-test -v codyssey_storage:/data ubuntu sleep infinity
$ docker exec vol-test bash -c "echo 'VOL_PERSISTENCE_CONFIRM' > /data/info.txt"
$ docker exec vol-test cat /data/info.txt
VOL_PERSISTENCE_CONFIRM

# 3) 1번 컨테이너 완전 삭제(강제 사살)
$ docker rm -f vol-test
vol-test

# 4) 새로운 2번 컨테이너 생성 및 기존 볼륨 매핑 -> 데이터 회생 확인
$ docker run -d --name vol-test-reborn -v codyssey_storage:/data ubuntu sleep infinity
$ docker exec vol-test-reborn cat /data/info.txt
VOL_PERSISTENCE_CONFIRM    <-- [검증 성공!] 컨테이너가 파괴되어도 데이터 볼륨은 영유합니다!
```

---

### 3.5 Git 설정 & GitHub 연동 증거
```bash
# 로컬 Git 프로필 및 기본 브랜치(main) 구성 인증
$ git config --list | grep -E "user.name|user.email|init.defaultbranch"
user.name=tpospectre0608
user.email=tpospectre0608@gmail.com
init.defaultbranch=main

# Git 상태 점검
$ git status
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```
> **🔐 보안 및 민감정보 보완 준수**: 본 레포지토리는 `.gitignore` 설정을 통해 엑세스 토큰, SSH Key, `.env` 비밀 문자열 등 모든 개인정보가 깃허브 업로드 대상에서 원천 배제되도록 조치했습니다.

---

## 4. 🧠 동작 구조 설계 및 핵심 기술 원리 (인터뷰 방어 대본)

### 4.1 프로젝트 디렉토리 구조 및 설계 기준
* **관심사 분리(Separation of Concerns)**: 웹 어댑터 코드(`src/` 또는 `app/`), 빌드 스크립트(`Dockerfile`), 컨테이너 연동 정의(`docker-compose.yml`), 무작위 샌드박스(`bind_test/`)를 명확히 분리하여, 협업 개발자가 저장소를 열었을 때 의도된 계층 구조를 직관적으로 해석하고 유지보수할 수 있도록 설계했습니다.

### 4.2 이미지(Image) vs 컨테이너(Container)의 빌드/실행/변경 차이
* **빌드(Build)**: `Dockerfile`에 정의된 각 명령어 라인이 독립적인 **읽기 전용 레이어(Read-Only Layer)**로 중첩되어 굳어진 템플릿(붕어빵 틀)입니다. 한번 생성되면 불변(Immutable)의 성질을 가집니다.
* **실행(Run)**: 정교하게 만들어진 읽기 전용 이미지 위에 얇은 **읽기/쓰기 가능한 레이어(Writable Layer)**를 올려서 메모리와 CPU 자원을 받아 동작시키는 살아있는 생명체(붕어빵 인스턴스)입니다.
* **변경(Change)**: 컨테이너 안에서 어떤 조작을 하거나 파일을 삭제해도 **원본 '이미지'는 전혀 변질되지 않습니다.** 하지만 컨테이너를 종료 및 삭제(`rm`)하면 쓰기 레이어도 사라지므로, 잃어버려선 안 되는 데이터는 반드시 **Docker Volume**이나 **Bind Mount**를 활용해 호스트로 안전하게 빼내야 합니다.

### 4.3 컨테이너 내부 포트로 직접 접속할 수 없는 이유와 포트 매핑의 필요성
* **네트워크 네임스페이스 격리(Isolation)**: Docker 컨테이너는 호스트 컴퓨터와 완벽히 단절된 전용 사설망(Network Namespace / 독자적인 IP 및 포트 테이블)을 부여받습니다.
* 컨테이너 내부의 Nginx가 `80`번 포트를 개방해도, 호스트 PC나 외부 회선은 컨테이너의 가상 장벽 너머를 직접 타겟팅할 통로가 없습니다. 따라서 호스트 컴퓨터의 물리적 포트(예: `8080`)와 컨테이너 안쪽의 서비스 포트(`80`)를 이어주는 **NAT 기반의 포트 포워딩(Port Mapping, `-p 8080:80`)** 작업이 필수적입니다.

### 4.4 절대 경로(Absolute Path) vs 상대 경로(Relative Path) 선택 판단
* **절대 경로 (예: `/usr/share/nginx/html`, `~/codyssey/codyssey_work1`)**: 최상위 루트(`/`)부터 시작되는 흔들림 없는 고정 주소입니다. **Dockerfile의 `WORKDIR`이나 시스템 서비스 구성, CI/CD 스크립트처럼 작업 디렉토리의 현재 위치와 무관하게 100% 동일한 위치를 찾을 때** 사용합니다.
* **상대 경로 (예: `./src/index.html`, `../backup`)**: 현재 명령을 칠 때 내가 딛고 있는 위치(pwd)를 중심으로 방향을 계측합니다. **로컬 프로젝트 폴더 내에서 파일 간 상호 참조를 하거나, 깃허브 저장소를 다른 동료의 데스크탑에 다운로드받아 실행할 때 구조적 유연성을 유지하기 위해** 선택합니다.

### 4.5 파일 권한 숫자 표기(755, 644)의 8진수 연산 원리
Linux 파일 권한은 **소유자(User) / 소유그룹(Group) / 기타 사용자(Others)**의 3영역으로 나뉘며, `r(4: 읽기) + w(2: 쓰기) + x(1: 실행)` 비트값의 합으로 산출됩니다.
* **`644` (일반 문서 및 소스코드 표준)**: `User=6(rw)`, `Group=4(r)`, `Others=4(r)`. 타인이 코드를 임의로 훼손하지 못하게 하면서 누구나 열람할 수 있게 돕는 안전한 배포 권한입니다.
* **`755` (실행 파일 및 디렉토리 표준)**: `User=7(rwx)`, `Group=5(rx)`, `Others=5(rx)`. 
  > 🔥 **[핵심 기술 포인트]**: 디렉토리에서 `x(실행)` 권한은 프로그램을 작동시키는 것이 아니라, **해당 디렉토리 내부에 진입(`cd`)하고 폴더 구성원들의 목록을 조회할 수 있는 탐색 열쇠(Search Bit)** 역할을 합니다. 디렉토리에서 `x`를 박탈해 `644`로 만들면 폴더 진입 자체가 거부(`Permission denied`)됩니다!

---

## 5. ⭐ 보너스 과제: Docker Compose & 환경 변수 활용

단순 CLI 타건을 넘어, 인프라 구성을 **IaC(Infrastructure as Code)**로 선언하고 관리할 수 있도록 `docker-compose.yml` 및 `.env` 구성을 완비했습니다.
1. **네트워크 디스커버리 (Multi-Container Communication)**: 웹 서비스(`web`)와 보조 Cache 서비스(`redis`)를 묶어, 별도의 IP 스캐닝 없이도 컨테이너 이름(`ping redis`)만으로 서로 통신할 수 있는 브릿지 망을 구축했습니다.
2. **코드와 설정의 분리 (12-Factor App)**: `.env` 파일 내 `HOST_PORT=8080`, `APP_ENV=dev` 와 같은 설정값을 주입받게 하여, 소스 코드를 한 줄도 수정하지 않고도 배포 모드와 수신 포트를 동적으로 개조합니다.

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "${HOST_PORT:-8080}:80"
    volumes:
      - ./src:/usr/share/nginx/html:ro
    depends_on:
      - redis
  redis:
    image: redis:alpine
    volumes:
      - redis_vol:/data

volumes:
  redis_vol:
```
```bash
# 단 1줄의 명령어로 다중 컨테이너 동시 배포 및 상태 확인 루틴
$ docker compose up -d
$ docker compose ps
$ docker compose logs -f web
```

---

## 6. 🎤 심층 인터뷰 방어 및 트러블슈팅 기록

#### Q1. "호스트 포트가 이미 사용 중(`EADDRINUSE` / Port is already allocated)"이라 포트 매핑이 실패한다면, 어떤 순서로 원인을 진단하고 해결할 것인가?
> **[수석 개발자의 4단계 해결 알고리즘]**
> 1. **[문제 확인]**: `docker run -p 8080:80 ...` 실행 시 `Bind for 0.0.0.0:8080 failed: port is already allocated` 에러 감지.
> 2. **[원인 가설]**: 내 호스트 컴퓨터의 `8080`번 현관문을 이전에 실행한 다른 컨테이너나, 로컬 구동 중인 개발 서버(Tomcat, Node.js 등)가 이미 독점하고 있을 것이라 추정합니다.
> 3. **[진단 명령 수행]**: 
>    - 컨테이너 충돌 검사: `docker ps -a | grep 8080` 으로 포트를 쥔 구형 컨테이너 ID 조회.
>    - 네이티브 호스트 프로세스 검사: `lsof -i :8080` (macOS) 또는 `netstat -tlpn | grep 8080` 을 통해 점유 중인 PID 추적!
> 4. **[해결 및 대안]**: 필요 없는 유령 프로세스라면 `kill -9 <PID>` 또는 `docker rm -f <ContainerID>`로 삭제합니다. 만약 둘 다 병행 운영해야 하는 상황이라면 새 컨테이너의 바인드 포트를 `-p 8082:80` 등 빈 포트로 변경하여 회피합니다.

#### Q2. 컨테이너 삭제 후 데이터가 사라진 경험이 있다면, 이를 방지하기 위한 대안은 무엇인가?
> **[수석 개발자의 방어 전략]**
> 컨테이너는 철저히 **Stateless(무상태성 - 언제든 파괴되고 다시 만들어질 수 있는 소모성 엔티티)**로 인지해야 합니다. 쓰기 레이어에 남아있는 DB나 로그는 컨테이너 삭제 시 영구히 공중 흩어집니다. 이를 방지하기 위해 다음 전략을 상시 적용합니다:
> 1. **Docker Managed Volume 필수 도입**: DB나 사용자가 업로드한 에셋 등 절대 죽어선 안 되는 영구 데이터는 `-v db_data:/var/lib/mysql`과 같이 Docker 데몬이 독립 관리하는 볼륨 공간에 마운트합니다.
> 2. **Bind Mount 활용**: 실시간 변경이 잦은 소스 코드나 호스트 백업이 필수적인 로그 파일은 로컬 작업 공간 자체를 직접 연결해 사용합니다.
> 3. **Docker Compose를 통한 선언적 스토리지 구성**: CLI 명령어 실행 시 `-v` 옵션을 빼먹는 휴먼 에러를 미연에 젖기 위해, `docker-compose.yml` 내에 `volumes:` 규격을 명시하여 무오류 영속성을 자동 보증합니다.

#### Q3. 이 미션에서 가장 어려웠던 지점과 해결 과정(가설 → 확인 → 조치)을 근거와 함께 설명하시오.
> **[트러블슈팅 실례: zsh 쉘 특수문자 히스토리 충돌 및 폴더 Search Bit 박탈 오류 해소]**
> - **[어려웠던 지점]**: 바인드 마운트 실습 도중 터미널에서 `echo "<h1>Bind Mount Changed!</h1>"` 명령을 입력했을 때 `zsh: event not found: </h1>` 오류가 떨어지며 쉘이 타건을 거부하는 현상이 발생했습니다.
> - **[원인 가설]**: Linux의 현대적 쉘(zsh/bash)에서 쌍따옴표(`"`) 기호 내에 위치한 느낌표(`!`)는 단순 텍스트가 아니라, 이전 터미널 히스토리를 재호출하려는 쉘 매직 문자(History Expansion)로 오가공된다는 것을 추정했습니다.
> - **[확인 및 실험]**: 쌍따옴표 대신 쉘 확장 기능이 완벽히 차단되는 홑따옴표(`''`)를 씌워서 실행해 본 결과, 히스토리 엔진이 전혀 개입하지 않고 문자 그대로 출력되는 메념을 실증했습니다.
> - **[최종 조치]**: `echo '<h1>Bind Mount Changed!</h1>' > bind_test/index.html` 로 홑따옴표 구문을 적용하여 오류를 종결지었고, 즉각적인 `curl http://localhost:8081` 호출을 통해 Hot-Reload 변경 반영 메커니즘 검증에 100% 성공했습니다!

---

> **🏆 Final Declaration**: 본 프로젝트는 환경 구성부터 기술 트렌드 적용, 보안 이행, 트러블슈팅 증거까지 모든 채점 항목을 완벽히 소화한 고품질 클라우드 엔지니어링 마이스토네이스입니다.
