const fioErrCode = {
    PERMISSION_REFUSED: 1,
    NO_FACES_DETECTED: 2,
    UNRECOGNIZED_FACE: 3,
    MANY_FACES: 4,
    PAD_ATTACK: 5,
    FACE_MISMATCH: 6,
    NETWORK_IO: 7,
    WRONG_PIN_CODE: 8,
    PROCESSING_ERR: 9,
    UNAUTHORIZED: 10,
    TERMS_NOT_ACCEPTED: 11,
    UI_NOT_READY: 12,
    SESSION_EXPIRED: 13,
    TIMEOUT: 14,
    TOO_MANY_REQUESTS: 15,
    EMPTY_ORIGIN: 16,
    FORBIDDDEN_ORIGIN: 17,
    FORBIDDDEN_COUNTRY: 18,
    UNIQUE_PIN_REQUIRED: 19,
    SESSION_IN_PROGRESS: 20,
    FACE_DUPLICATION: 21,
    MINORS_NOT_ALLOWED: 22,
  },
  fioState = {
    UI_READY: 1,
    PERM_WAIT: 2,
    PERM_REFUSED: 3,
    PERM_GRANTED: 4,
    REPLY_WAIT: 5,
    PERM_PIN_WAIT: 6,
    AUTH_FAILURE: 7,
    AUTH_SUCCESS: 8,
  },
  fioNotification = { NOTICE: 1, WARNING: 2, ERR: 3 },
  fioNotificationStatus = { SHOWING: 1, HIDING: 2 };
class faceIO {
  constructor(t) {
    (this.VERSION = "2.3"),
      (this.Author =
        "Copyright (C) 2019 - 2024 PixLab | Symisc Systems <support@faceio.net>. All rights reserved."),
      (this._pub_app_id = t),
      (this._app_rand_token = (function () {
        let t = "";
        for (let i = 0; i < 32; i++)
          t += "abcdef0123456789".charAt(Math.floor(16 * Math.random()));
        return t;
      })()),
      (this._srv_payload = null),
      (this._authParam = {}),
      (this._locale = {}),
      (this._videoElem = null),
      (this._grayBuf = null),
      (this._recs = null),
      (this._state = fioState.UI_READY),
      (this._isEnrollment = !1),
      (this._isIdVerify = !1),
      (this._pin = ""),
      (this._cnpin = null),
      (this._activeUi = null),
      (this._resolve = null),
      (this._reject = null),
      (this._temp_token = null),
      (this._frame_offset = 0),
      (this._n_faces = 0),
      (this._wss = null),
      (this._socket = null),
      (this._frame_ack = !1),
      (this._threshold = 12),
      (this._rc = 0),
      (this._fival = null),
      (this._sival = null),
      (this._pinPad = !1),
      (this._rejectWeakPin = !1),
      (this._pinmax = 16),
      (this._consentId = null),
      (this._termsOfUse = ""),
      (this._refreshSession = !1),
      (this._clearWidget = !1),
      (this._requestLv = !1),
      (this._rectColor = "#32cd32"),
      (this._notification = null),
      (this._notificationTimeout = 0),
      (this._notificationColors = {
        1: { background: "#32cd32", border: "#228B22" },
        2: { background: "#ff4d00", border: "#8B4513" },
        3: { background: "#ff0000", border: "#8B0000" },
      }),
      (this._canvasSize = { width: 640, height: 480 });
  }
  _defaultParamValues(t) {
    switch (t) {
      case "userConsent":
        return !1;
      case "payload":
        return null;
      case "termsTimeout":
        return 6e5;
      case "permissionTimeout":
      case "idleTimeout":
        return 27e3;
      case "replyTimeout":
        return 4e4;
      case "enrollIntroTimeout":
        return 12e3;
      case "locale":
      case "language":
        return "auto";
    }
    return null;
  }
  _toggleSpinner() {
    const t = faceIO.fioShadowDOM.getElementById("fioSpin");
    null !== t && t.classList.toggle("faceio-spinner");
  }
  _launchModal() {
    const t = faceIO.fioShadowDOM.getElementById("fioUiModal");
    null !== t &&
      (t.classList.remove("fio-hide-modal"), t.classList.add("fio-show-modal"));
  }
  _closeModal() {
    const t = faceIO.fioShadowDOM.getElementById("fioUiModal");
    null !== t &&
      (t.classList.add("fio-hide-modal"), t.classList.remove("fio-show-modal"));
  }
  _showCloseBtn() {
    const t = faceIO.fioShadowDOM.getElementById("fioCloseBtn");
    null !== t && (t.style.display = "block");
  }
  _setActiveUi(t) {
    const i = faceIO.fioShadowDOM.getElementById(t);
    if (null !== i) {
      if (null !== this._activeUi) {
        if (this._activeUi.isSameNode(i)) return;
        this._activeUi.setAttribute("hidden", "true");
      }
      i.removeAttribute("hidden"), (this._activeUi = i);
    }
  }
  _printMsg(t, i) {
    const e = faceIO.fioShadowDOM.getElementById(i);
    null !== e && (e.textContent = t);
  }
  _showSuccessWindow() {
    this._setActiveUi("fioAuthOk"),
      this._printMsg(this._locale.AUTH_OK, "fioAuthOkTxt");
  }
  _showFailureWindow(t) {
    this._setActiveUi("fioAuthFail"),
      null !== t
        ? t.length > 0 && this._printMsg(t, "fioAuthFailTxt")
        : this._printMsg(this._locale.AUTH_FAIL, "fioAuthFailTxt");
  }
  _cleanNotification() {
    this._notificationTimeout && clearTimeout(this._notificationTimeout),
      (this._notification = null),
      (this._notificationTimeout = 0);
  }
  _createNotification(t, i) {
    if (null != this._notification) {
      if (this._notification.msg === t) return;
      if (i < this._notification.type) return;
    }
    clearTimeout(this._notificationTimeout),
      (this._notificationTimeout = 0),
      (this._notification = {
        msg: t,
        type: i,
        currentY: -140,
        status: fioNotificationStatus.SHOWING,
      }),
      i == fioNotification.ERR &&
        ((this._frame_ack = !1),
        (this._rectColor = "#ff4d00"),
        setTimeout(() => {
          (this._rectColor = "#32cd32"), (this._frame_ack = !0);
        }, 3500));
  }
  _showNotification(t) {
    if (!this._notification) return;
    const i = (t, i) => {
        (t.fillStyle = "white"),
          (t.font = `bold ${i}px Arial`),
          (t.textBaseline = "middle"),
          (t.textAlign = "center");
      },
      e = (t, i) => {
        if (!this._notification) return;
        const s = i - this._notification.currentY;
        Math.abs(s) > 1
          ? ((this._notification.currentY += 0.1 * s),
            requestAnimationFrame(() => e(t, i)))
          : ((this._notification.currentY = i),
            "down" !== t ||
              this._notificationTimeout ||
              (this._notificationTimeout = setTimeout(() => {
                (this._notification.status = fioNotificationStatus.HIDING),
                  e("up", -(h + a + n));
              }, 4500)),
            "up" === t &&
              (clearTimeout(this._notificationTimeout),
              (this._notificationTimeout = 0),
              (this._notification = null)));
      },
      s = 26.4,
      o = this._canvasSize.width,
      a = 10,
      n = 25;
    i(t, 22);
    const r = ((t, i, e, s) => {
        const o = i.split(" ");
        let a = "",
          n = 1;
        for (let i = 0; i < o.length; i++) {
          const s = a + o[i] + " ";
          t.measureText(s).width > e && i > 0
            ? ((a = o[i] + " "), n++)
            : (a = s);
        }
        return n;
      })(t, this._notification.msg, o),
      h = 80 + (r - 1) * s,
      l = r * s,
      _ = o / 2,
      c = this._notification.currentY + (h - l) / 2 + 13.2;
    this._notification.status === fioNotificationStatus.SHOWING && e("down", n),
      ((t, i, e, s, o) => {
        (t.fillStyle =
          this._notificationColors[this._notification.type].background),
          (t.strokeStyle =
            this._notificationColors[this._notification.type].border),
          (t.lineWidth = 2),
          t.beginPath(),
          t.moveTo(i + e, this._notification.currentY + i),
          t.lineTo(o - e - i, this._notification.currentY + i),
          t.arcTo(
            o - i,
            this._notification.currentY + i,
            o - i,
            this._notification.currentY + e + i,
            e
          ),
          t.lineTo(o - i, this._notification.currentY + s - e - i),
          t.arcTo(
            o - i,
            this._notification.currentY + s - i,
            o - e - i,
            this._notification.currentY + s - i,
            e
          ),
          t.lineTo(i + e, this._notification.currentY + s - i),
          t.arcTo(
            i,
            this._notification.currentY + s - i,
            i,
            this._notification.currentY + s - e - i,
            e
          ),
          t.lineTo(i, this._notification.currentY + e + i),
          t.arcTo(
            i,
            this._notification.currentY + i,
            i + e,
            this._notification.currentY + i,
            e
          ),
          t.closePath(),
          t.fill(),
          t.stroke();
      })(t, a, 10, h, o),
      i(t, 22),
      ((t, i, e, s, o, a) => {
        const n = i.split(" ");
        let r = "";
        for (let i = 0; i < n.length; i++) {
          const h = r + n[i] + " ";
          t.measureText(h).width > o && i > 0
            ? (t.fillText(r, e, s), (r = n[i] + " "), (s += a))
            : (r = h);
        }
        t.fillText(r, e, s);
      })(t, this._notification.msg, _, c, o, s);
  }
  _showInstructions(t, i) {
    const e = 0.8 * this._canvasSize.width,
      s = 20;
    let o = (this._canvasSize.width - e + 5) / 2,
      a = e - 10 - 30,
      n = 0;
    let r =
        (t.forEach((t) => {
          let e = t.split(" "),
            s = "";
          n += 27;
          for (let t = 0; t < e.length; t++) {
            let o = s + e[t] + " ";
            i.measureText(o).width > a &&
              t > 0 &&
              ((s = e[t] + " "), (n += 18));
          }
        }),
        n + 27 + 40),
      h = this._canvasSize.height - r;
    (i.filter = "blur(2px)"),
      (i.fillStyle = "rgba(0, 0, 0, .9)"),
      i.beginPath(),
      i.moveTo(o + s, h + 5),
      i.lineTo(o + e - s - 5, h + 5),
      i.arcTo(o + e - 5, h + 5, o + e - 5, h + s + 5, s),
      i.lineTo(o + e - 5, h + r - s - 5),
      i.arcTo(o + e - 5, h + r - 5, o + e - s - 5, h + r - 5, s),
      i.lineTo(o + s, h + r - 5),
      i.arcTo(o, h + r - 5, o, h + r - s - 5, s),
      i.lineTo(o, h + s + 5),
      i.arcTo(o, h + 5, o + s, h + 5, s),
      i.closePath(),
      i.fill(),
      (i.filter = "none"),
      (i.strokeStyle = "rgba(255, 255, 255, 1)"),
      (i.lineWidth = 2),
      i.stroke();
    let l = o + 5 + 15,
      _ = h + 15 + 27;
    (i.font = "400 18px -apple-system, BlinkMacSystemFont, Ubuntu, Calibri"),
      (i.textBaseline = "bottom"),
      (i.fillStyle = "#fff"),
      (i.textAlign = "left"),
      t.forEach((t) => {
        let e = t.split(" "),
          s = "";
        for (let t = 0; t < e.length; t++) {
          let o = s + e[t] + " ";
          i.measureText(o).width > a && t > 0
            ? (i.fillText(s.trim(), l, _), (s = e[t] + " "), (_ += 18))
            : (s = o);
        }
        "" !== s.trim() && (i.fillText(s.trim(), l, _), (_ += 27));
      });
  }
  _runTimer(t, i, e) {
    const s = faceIO.fioShadowDOM.getElementById(i);
    if (null !== s) {
      let i = t;
      s.textContent = i / 1e3;
      const o = setInterval(() => {
        (i < 1 || (null === e && this._state != fioState.PERM_WAIT)) &&
          (clearInterval(o), null !== e && e()),
          (i -= 100),
          i % 1e3 == 0 && (s.textContent = i < 0 ? "0" : i / 1e3);
      }, 100);
    }
  }
  _showCameraAuthorizationWindow(t) {
    this._setActiveUi("fioCameraAuthorize"),
      this._printMsg(this._locale.ALLOW_ACCESS, "fioCamTxt"),
      this._runTimer(t, "fioCameraTimer", null);
  }
  _showCanvas() {
    null !== this._videoElem && this._videoElem.play(),
      this._setActiveUi("fioStream");
  }
  _CanvasUnpaint() {
    null === this._videoElem ||
      this._videoElem.paused ||
      this._videoElem.ended ||
      this._videoElem.pause();
  }
  _showLoadingWindow(t) {
    this._CanvasUnpaint(),
      this._setActiveUi("fioNetWait"),
      this._printMsg(t, "fioWaitTxt");
  }
  _stopCameraStream() {
    if (null !== this._videoElem) {
      this._videoElem.srcObject.getTracks().forEach(function (t) {
        t.stop();
      }),
        (this._videoElem.srcObject = null),
        (this._videoElem = null);
    }
    this._srv_payload = null;
  }
  _closeSocket() {
    null !== this._socket && (this._socket.close(), (this._socket = null));
  }
  _handleFailure(t, i) {
    void 0 === t && (t = fioErrCode.NETWORK_IO),
      null !== this._temp_token && (this._state = fioState.PERM_REFUSED),
      this._closeSocket(),
      this._stopCameraStream(),
      this._CanvasUnpaint(),
      this._cleanNotification(),
      (this._pin = ""),
      t != fioErrCode.SESSION_EXPIRED &&
        (this._showFailureWindow(i),
        setTimeout(() => {
          this._showCloseBtn(), this._closeModal();
        }, 2e3),
        this._reject(t));
  }
  _handleSuccess(t) {
    (this._state = fioState.AUTH_SUCCESS),
      this._closeSocket(),
      this._stopCameraStream(),
      this._CanvasUnpaint(),
      this._cleanNotification(),
      this._showSuccessWindow(),
      (this._pin = ""),
      setTimeout(() => {
        this._showCloseBtn(), this._closeModal();
      }, 2e3),
      this._resolve(t);
  }
  _permNotgranted() {
    this._handleFailure(
      fioErrCode.PERMISSION_REFUSED,
      this._locale.PERM_REFUSED
    );
  }
  _newSocketBuffer(t) {
    if (null === this._srv_payload) {
      this._srv_payload = new Uint8ClampedArray(t);
      for (let t = 1; t <= this._temp_token.length; t++)
        this._srv_payload[t] = this._temp_token.charCodeAt(t - 1);
    }
  }
  _sendPin() {
    let t = 1 + this._temp_token.length + this._pin.length + 1,
      i = null;
    this._isEnrollment &&
      ((i = JSON.stringify(this._authParam.payload)), (t += 2 + i.length)),
      this._newSocketBuffer(t),
      (this._frame_offset = 1 + this._temp_token.length),
      (this._srv_payload[this._frame_offset + 0] = 255 & this._pin.length);
    for (let t = 1; t <= this._pin.length; t++)
      this._srv_payload[this._frame_offset + t] = this._pin.charCodeAt(t - 1);
    if (this._isEnrollment) {
      let t = this._frame_offset + this._pin.length + 1;
      (this._srv_payload[t + 0] = 255 & i.length),
        (this._srv_payload[t + 1] = i.length >> 8),
        (t += 2);
      for (let e = 0; e < i.length; e++)
        this._srv_payload[t + e] = i.charCodeAt(e);
    }
    this._socket.send(this._srv_payload.buffer),
      (this._state = fioState.REPLY_WAIT),
      this._showLoadingWindow(this._locale.WAIT_PROCESSING),
      (this._sival = setTimeout(() => {
        this._state == fioState.REPLY_WAIT &&
          this._handleFailure(fioErrCode.TIMEOUT, null);
      }, this._authParam.replyTimeout));
  }
  _enrollSetStep(t) {
    const i = faceIO.fioShadowDOM.getElementById("eStep" + t);
    null !== i && i.classList.add("fio-ui-modal-done");
  }
  _enrollConfirmPin(t) {
    if (null !== this._cnpin)
      this._cnpin != this._pin
        ? (this._printMsg(this._locale.CONFIRM_PIN_ERR, "fioPinTip"),
          (this._pin = ""),
          t && (t.classList.add("fio-ui-pin-wrong"), (t.value = "")))
        : (this._printMsg(this._locale.CONFIRM_PIN_OK, "fioPinTip"),
          (this._cnpin = null),
          this._sendPin());
    else {
      let i = !1;
      if (this._rejectWeakPin && ((i = this._pin.length < 5), !i)) {
        let t = this._pin.split("").map(Number);
        const e = (t) => t.every((t, i, e) => !i || t == e[i - 1]);
        if (e(t)) i = !0;
        else {
          if (
            ((t) =>
              t.every(
                (t, i, e) =>
                  !i || i > 8 || t - e[i - 1] == 1 || t - e[i - 1] == -1
              ))(t)
          )
            i = !0;
          else {
            const s = t.pop();
            e(t) ? (i = !0) : (t.push(s), t.shift(), e(t) && (i = !0));
          }
        }
      }
      i
        ? (this._printMsg(this._locale.WEAK_PIN, "fioPinTxt"),
          this._printMsg(this._locale.WEAK_PIN_HINT, "fioPinTip"),
          t && t.classList.add("fio-ui-pin-wrong"))
        : ((this._cnpin = this._pin),
          this._printMsg(this._locale.CONFIRM_PIN, "fioPinTxt"),
          this._printMsg(this._locale.CONFIRM_PIN_HINT, "fioPinTip"),
          t && t.classList.add("fio-ui-pin-ok")),
        (this._pin = ""),
        t && (t.value = "");
    }
  }
  _handlePinCodePress(t, i) {
    switch (t) {
      case "done":
        return void (this._pin.length < 4
          ? (this._printMsg(this._locale.SMALL_PIN, "fioPinTip"),
            i && i.classList.add("fio-ui-pin-wrong"))
          : this._isEnrollment
          ? this._enrollConfirmPin(i)
          : this._sendPin());
      case "backspace":
        this._pin.length > 0 &&
          (this._pin = this._pin.substring(0, this._pin.length - 1));
        break;
      default:
        if (isNaN(t))
          return (
            this._printMsg(this._locale.WRONG_PIN_NUM, "fioPinTip"),
            void (i && i.classList.add("fio-ui-pin-wrong"))
          );
        if (((this._pin += t), this._pin.length >= this._pinmax))
          return void (this._isEnrollment
            ? this._enrollConfirmPin(i)
            : this._sendPin());
    }
    i &&
      ((i.value = "_".repeat(this._pin.length)),
      i.classList.remove("fio-ui-pin-wrong"),
      i.classList.remove("fio-ui-pin-ok"));
  }
  _generatePinPad() {
    if (((this._srv_payload = null), !this._pinPad)) {
      this._isEnrollment && this._enrollSetStep(2);
      const t = [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "backspace",
          "0",
          "done",
        ],
        i = faceIO.fioShadowDOM.getElementById("fioPin__numpad");
      if (null !== i) {
        const e = faceIO.fioShadowDOM.getElementById("fioPinInput");
        t.forEach((t) => {
          const s = document.createElement("button");
          "backspace" == t
            ? (s.classList.add("fio-ui-modal-delete"),
              (s.innerHTML = "&crarr;"))
            : "done" == t
            ? (s.classList.add("fio-ui-modal-done"),
              (s.innerHTML =
                '<span style="color: #00FF00 !important;"><strong>&#10004;</strong></span>'),
              s.setAttribute("type", "submit"),
              s.setAttribute("title", this._locale.CONFIRM_PIN))
            : (s.textContent = t),
            s.addEventListener("click", () => {
              this._handlePinCodePress(t, e);
            }),
            i.appendChild(s);
        }),
          (this._pinPad = !0);
      }
    }
  }
  _showPinPad() {
    if (
      (this._generatePinPad(),
      this._setActiveUi("fioPinPad"),
      this._isEnrollment)
    )
      this._printMsg(this._locale.CHOOSE_PIN, "fioPinTxt"),
        this._printMsg(this._locale.CHOOSE_PIN_HINT, "fioPinTip");
    else if (this._pin.length > 0) {
      (this._pin = ""), this._printMsg(this._locale.WRONG_PIN, "fioPinTxt");
      const t = faceIO.fioShadowDOM.getElementById("fioPinInput");
      t && (t.classList.add("fio-ui-pin-wrong"), (t.value = ""));
    } else
      this._printMsg(this._locale.ENTER_PIN, "fioPinTxt"),
        this._printMsg(this._locale.PIN_HINT, "fioPinTip");
  }
  _requestNewFrame() {
    (this._n_faces = 0),
      this._isEnrollment
        ? !0 === this._requestLv
          ? this._createNotification(
              this._locale.LV_ACTION,
              fioNotification.WARNING
            )
          : this._createNotification(
              this._locale.FACE_INSTR,
              fioNotification.NOTICE
            )
        : ((this._threshold += 1),
          this._createNotification(
            this._locale.NO_FACES_DETECTED,
            fioNotification.WARNING
          )),
      this._showCanvas(),
      setTimeout(() => {
        this._frame_ack = !0;
      }, 200);
  }
  _launchVideoStream() {
    if (this._state != fioState.UI_READY) return;
    (this._state = fioState.PERM_WAIT),
      this._showCameraAuthorizationWindow(this._authParam.permissionTimeout);
    let t = { width: 640, height: 480, facingMode: "user" };
    window.matchMedia("only screen and (max-width: 760px)").matches && (t = !0),
      setTimeout(() => {
        this._state == fioState.PERM_WAIT && this._permNotgranted();
      }, this._authParam.permissionTimeout),
      navigator.mediaDevices
        .getUserMedia({ audio: !1, video: t })
        .then((t) => {
          if (this._state == fioState.PERM_REFUSED)
            setTimeout(() => {
              t.getTracks().forEach(function (t) {
                t.stop();
              });
            }, 1e3);
          else {
            (this._state = fioState.PERM_GRANTED),
              (this._socket = new WebSocket(this._wss)),
              this._printMsg(this._locale.ACCESS_GRANTED, "fioCamTxt"),
              (this._socket.binaryType = "blob"),
              (this._socket.onerror = (t) => {
                this._handleFailure(fioErrCode.NETWORK_IO, null);
              }),
              (this._socket.onclose = (t) => {
                this._state == fioState.REPLY_WAIT &&
                  this._handleFailure(fioErrCode.NETWORK_IO, null);
              }),
              this._socket.addEventListener("open", (t) => {
                this._frame_ack = !0;
                let i = new Uint8ClampedArray(this._temp_token.length + 1);
                for (let t = 1; t <= this._temp_token.length; t++)
                  i[t] = this._temp_token.charCodeAt(t - 1);
                this._socket.send(i.buffer);
              }),
              this._socket.addEventListener("message", (t) => {
                (this._state = fioState.PERM_GRANTED),
                  null !== this._sival &&
                    (clearTimeout(this._sival), (this._sival = null));
                const i = JSON.parse(t.data);
                if (
                  ((this._rc = i.code),
                  null !== this._fival &&
                    (clearTimeout(this._fival), (this._fival = null)),
                  this._isEnrollment)
                )
                  if (201 == this._rc)
                    !0 === this._requestLv
                      ? (this._setActiveUi("fioFaceInst"),
                        this._printMsg(
                          this._locale.LV_ACTION,
                          "fioFaceInstrTitle"
                        ),
                        setTimeout(() => {
                          this._requestNewFrame();
                        }, 4e3))
                      : this._requestNewFrame();
                  else if ((this._stopCameraStream(), 200 == this._rc))
                    this._enrollSetStep(3), this._handleSuccess(i.payload);
                  else if (202 == this._rc)
                    this._setActiveUi("fioPinIntro"),
                      this._runTimer(
                        this._authParam.enrollIntroTimeout,
                        "fioPinIntroLoader",
                        () => {
                          (this._state = fioState.PERM_PIN_WAIT),
                            this._showPinPad();
                        }
                      );
                  else if (203 == this._rc) {
                    this._generatePinPad(),
                      this._setActiveUi("fioPinPad"),
                      (this._pin = ""),
                      this._printMsg(this._locale.UNIQUE_PIN, "fioPinTxt"),
                      this._printMsg(this._locale.UNIQUE_PIN_HINT, "fioPinTip");
                    const t = faceIO.fioShadowDOM.getElementById("fioPinInput");
                    t && (t.classList.add("fio-ui-pin-wrong"), (t.value = ""));
                  } else
                    400 == this._rc
                      ? this._handleFailure(i.fioErr, null)
                      : 430 == this._rc
                      ? this._handleFailure(fioErrCode.TIMEOUT, null)
                      : this._handleFailure(fioErrCode.NETWORK_IO, null);
                else if (201 == this._rc) this._requestNewFrame();
                else if ((this._stopCameraStream(), 200 == this._rc)) {
                  let t = i.userData;
                  (t.payload = JSON.parse(t.payload)), this._handleSuccess(t);
                } else
                  429 == this._rc
                    ? this._handleFailure(fioErrCode.UNRECOGNIZED_FACE, null)
                    : 430 == this._rc
                    ? this._handleFailure(
                        this._n_faces < 1
                          ? fioErrCode.NO_FACES_DETECTED
                          : fioErrCode.TIMEOUT,
                        null
                      )
                    : 440 == this._rc
                    ? this._handleFailure(fioErrCode.WRONG_PIN_CODE, null)
                    : 400 == this._rc
                    ? this._handleFailure(i.fioErr, null)
                    : 202 == this._rc
                    ? ((this._pinmax = i.max), this._showPinPad())
                    : this._handleFailure(fioErrCode.NETWORK_IO, null);
              });
            const i = faceIO.fioShadowDOM.getElementById("fioVideo"),
              e = faceIO.fioShadowDOM.getElementById("fioCanvas"),
              s = e.getContext("2d", { willReadFrequently: !0 });
            i.srcObject = t;
            const o = () => {
              if (!i.paused && !i.ended) {
                if (
                  (s.clearRect(0, 0, e.width, e.height),
                  s.drawImage(i, 0, 0),
                  (s.font = "bold 25px Montserrat, sans-serif"),
                  (s.fillStyle = "#000000"),
                  (s.textBaseline = "top"),
                  (s.textAlign = "left"),
                  s.fillText("PixLab |", 2, 2),
                  null === this._grayBuf)
                )
                  (this._grayBuf = _realnet_alloc_gray_image_buffer(1280, 720)),
                    (this._recs = new Float32Array(
                      Module.HEAPU8.buffer,
                      _realnet_alloc_face_result_array(),
                      _realnet_face_max_detection()
                    ));
                else if (
                  null !== this._srv_payload &&
                  this._state == fioState.PERM_GRANTED
                ) {
                  const t = s.getImageData(0, 0, e.width, e.height);
                  let i = new Uint8ClampedArray(
                    Module.HEAPU8.buffer,
                    this._grayBuf,
                    t.width * t.height
                  );
                  for (
                    let e = this._frame_offset, s = 0;
                    s < t.data.length;
                    s += 4, e += 3
                  )
                    (i[s >> 2] =
                      (306 * t.data[s] +
                        601 * t.data[s + 1] +
                        117 * t.data[s + 2]) >>
                      10),
                      (this._srv_payload[e] = t.data[s + 2]),
                      (this._srv_payload[e + 1] = t.data[s + 1]),
                      (this._srv_payload[e + 2] = t.data[s]);
                  const o = _realnet_face_detect(
                    this._grayBuf,
                    t.width,
                    t.height,
                    this._threshold,
                    this._recs.byteOffset
                  );
                  if ((this._showNotification(s), 1 == o)) {
                    let i = this._requestLv ? 0.42 : 0.57;
                    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) &&
                      (i = this._requestLv ? 0.71 : 0.75);
                    const e = this._recs[2],
                      o = this._requestLv ? 130 : 118;
                    let a = !0;
                    if (
                      (this._recs[2] / t.width > i
                        ? (this._createNotification(
                            this._locale.BIG_FACE,
                            fioNotification.ERR
                          ),
                          !0 === this._requestLv && (this._srv_payload[0] = 1),
                          (a = !1))
                        : e < o &&
                          (this._createNotification(
                            this._locale.SMALL_FACE,
                            fioNotification.ERR
                          ),
                          !0 === this._requestLv && (this._srv_payload[0] = 1),
                          (a = !1)),
                      (s.strokeStyle = this._rectColor),
                      (s.lineJoin = "round"),
                      (s.lineWidth = 2),
                      s.strokeRect(
                        this._recs[0],
                        this._recs[1],
                        this._recs[2],
                        this._recs[3]
                      ),
                      this._frame_ack && a)
                    ) {
                      const i = this._frame_offset - 4;
                      (this._srv_payload[i + 0] = 255 & t.width),
                        (this._srv_payload[i + 1] = t.width >> 8),
                        (this._srv_payload[i + 2] = 255 & t.height),
                        (this._srv_payload[i + 3] = t.height >> 8),
                        this._socket.send(this._srv_payload.buffer),
                        (this._frame_ack = !1),
                        setTimeout(() => {
                          (this._state = fioState.REPLY_WAIT),
                            this._showLoadingWindow(
                              this._locale.WAIT_PROCESSING
                            ),
                            setTimeout(() => {
                              this._state == fioState.REPLY_WAIT &&
                                this._printMsg(
                                  this._locale.WAIT_PROCESSING_2,
                                  "fioWaitTxt"
                                );
                            }, 5300);
                        }, 900),
                        (this._sival = setTimeout(() => {
                          this._state == fioState.REPLY_WAIT &&
                            this._handleFailure(fioErrCode.TIMEOUT, null);
                        }, this._authParam.replyTimeout));
                    }
                  } else
                    o > 1
                      ? this._frame_ack &&
                        this._handleFailure(fioErrCode.MANY_FACES, null)
                      : 1 == this._srv_payload[0] &&
                        ((this._notification &&
                          this._notification.type == fioNotification.ERR) ||
                          ((s.strokeStyle = "#03459c"),
                          (s.lineJoin = "round"),
                          (s.lineWidth = 3),
                          s.strokeRect(
                            e.width / 2 - 107,
                            e.height / 2 - 107,
                            220,
                            220
                          )));
                  this._isEnrollment &&
                    !0 === this._requestLv &&
                    this._showInstructions(
                      this._locale.LV_INSTR.split("\n"),
                      s
                    ),
                    (this._n_faces += o);
                }
                requestAnimationFrame(o);
              }
            };
            (i.onloadedmetadata = (t) => {
              (e.width = i.videoWidth),
                (e.height = i.videoHeight),
                (this._canvasSize = { width: e.width, height: e.height }),
                this._newSocketBuffer(
                  this._frame_offset + i.videoWidth * i.videoHeight * 3
                ),
                this._isEnrollment,
                this._createNotification(
                  this._locale.FACE_INSTR,
                  fioNotification.NOTICE
                ),
                this._showCanvas(),
                i.play(),
                (this._videoElem = i);
            }),
              (i.onplay = () => {
                requestAnimationFrame(o),
                  null === this._fival &&
                    (this._fival = setTimeout(() => {
                      this._state == fioState.PERM_GRANTED &&
                        this._n_faces < 1 &&
                        this._handleFailure(fioErrCode.NO_FACES_DETECTED, null);
                    }, this._authParam.idleTimeout)),
                  setTimeout(() => {
                    this._state == fioState.PERM_GRANTED &&
                      this._n_faces < 1 &&
                      (this._srv_payload[0] = 1);
                  }, 6e3),
                  setTimeout(() => {
                    this._state == fioState.PERM_GRANTED &&
                      null !== this._videoElem &&
                      !this._videoElem.paused &&
                      this._n_faces < 1 &&
                      (this._setActiveUi("fioFaceInst"),
                      this._printMsg(
                        this._locale.NO_FACES_DETECTED,
                        "fioFaceInstrTitle"
                      ),
                      this._CanvasUnpaint(),
                      setTimeout(() => {
                        this._state == fioState.PERM_GRANTED &&
                          null !== this._videoElem &&
                          this._videoElem.paused &&
                          (this._createNotification(
                            this._locale.NO_FACES_DETECTED,
                            fioNotification.WARNING
                          ),
                          this._showCanvas());
                      }, 3e3));
                  }, 5700);
              });
          }
        })
        .catch((t) => {
          this._state != fioState.PERM_REFUSED &&
            ((this._state = fioState.PERM_REFUSED), this._permNotgranted());
        });
  }
  _clearConsentTimeout() {
    null !== this._consentId && clearTimeout(this._consentId),
      (this._consentId = null);
  }
  _acceptfioTerms() {
    this._clearConsentTimeout(), this._launchVideoStream();
  }
  _rejectfioTerms() {
    this._clearConsentTimeout(),
      this._handleFailure(
        fioErrCode.TERMS_NOT_ACCEPTED,
        this._locale.TERMS_REFUSED
      );
  }
  _requestUserConsent() {
    if (null !== this._consentId || this._state != fioState.UI_READY) return;
    (this._consentId = setTimeout(() => {
      this._state == fioState.UI_READY &&
        (this._clearConsentTimeout(),
        this._handleFailure(fioErrCode.TIMEOUT, this._locale.TERMS_REFUSED));
    }, this._authParam.termsTimeout)),
      this._setActiveUi("fioTerms");
    const t = faceIO.fioShadowDOM.getElementById("fioTermsTxt");
    null !== t && (t.textContent = this._termsOfUse);
  }
  _enrollProceed() {
    const t = faceIO.fioShadowDOM.getElementById("fioEnrollHeader");
    null !== t && t.hasAttribute("hidden") && t.removeAttribute("hidden"),
      !0 === this._authParam.userConsent
        ? this._launchVideoStream()
        : this._requestUserConsent();
  }
  _enrollUser() {
    this._setActiveUi("fioEnrollIntro"),
      this._runTimer(
        this._authParam.enrollIntroTimeout,
        "fioEnrollIntroLoader",
        () => {
          this._enrollProceed();
        }
      ),
      "" == this._termsOfUse &&
        0 == this._authParam.userConsent &&
        fetch("https://cdn.faceio.net/terms-of-use.txt")
          .then((t) => t.text())
          .then((t) => {
            this._termsOfUse = t;
          })
          .catch((t) => {
            this._termsOfUse =
              "The terms of Use agreement is available to consult online for this session at:\n\nhttps://faceio.net/terms-of-use";
          });
  }
  _idVerifyProceed() {
    const t = faceIO.fioShadowDOM.getElementById("fioIdVerifyHeader");
    null !== t && t.hasAttribute("hidden") && t.removeAttribute("hidden"),
      this._launchVideoStream();
  }
  _idVerifyUser() {
    this._setActiveUi("fioIdVerifyIntro"),
      this._runTimer(
        this._authParam.enrollIntroTimeout,
        "fioIdVerifyIntroLoader",
        () => {
          this._idVerifyProceed();
        }
      );
  }
  _prepareUi(t) {
    if (
      ((this._temp_token = t.temp_token),
      (this._frame_offset = 1 + this._temp_token.length + 4),
      (this._locale = t.locale),
      (this._refreshSession = t.sessReload),
      (this._requestLv = t.doPad),
      this._clearWidget)
    ) {
      const t = faceIO.fioShadowDOM.getElementById("fioUiModal");
      null !== t && t.remove(), (this._clearWidget = !1);
    }
    const i = document.createElement("div");
    if (
      ((i.innerHTML = t.html),
      faceIO.fioShadowDOM.appendChild(i),
      null === faceIO.fioShadowDOM.getElementById("fioUiModal"))
    )
      return !1;
    const e = faceIO.fioShadowDOM.getElementById("fioCloseBtn");
    if (
      (null !== e && e.addEventListener("click", this._closeModal.bind(this)),
      this._isEnrollment)
    ) {
      const i = faceIO.fioShadowDOM.getElementById("fio-terms-accept-btn");
      null !== i &&
        i.addEventListener("click", this._acceptfioTerms.bind(this));
      const e = faceIO.fioShadowDOM.getElementById("fio-terms-reject-btn");
      null !== e &&
        e.addEventListener("click", this._rejectfioTerms.bind(this)),
        setTimeout(() => {
          if (
            (this._printMsg(this._locale.ENROLL_INTRO_3, "enrollIntroHdr"),
            this._authParam.enrollIntroTimeout > 15e3)
          ) {
            const t = faceIO.fioShadowDOM.getElementById("fio-enroll-now-btn");
            null !== t &&
              (t.removeAttribute("hidden"),
              t.addEventListener("click", this._enrollProceed.bind(this)));
          }
        }, 5200),
        (this._rejectWeakPin = t.rejectWeakPin);
    }
    var s, o;
    return (
      (this._wss =
        ((s = t.wss),
        (o = this._app_rand_token),
        Array.from(s, (t, i) =>
          String.fromCharCode(t.charCodeAt() ^ o.charCodeAt(i % o.length))
        ).join(""))),
      (this._state = fioState.UI_READY),
      !0
    );
  }
  _fillParameters(t) {
    if (
      ((this._authParam = t instanceof Object ? t : (t = {})),
      t.hasOwnProperty("userConsent")
        ? (this._authParam.userConsent = !0 === t.userConsent)
        : (this._authParam.userConsent =
            this._defaultParamValues("userConsent")),
      t.hasOwnProperty("payload")
        ? (this._authParam.payload = t.payload)
        : (this._authParam.payload = this._defaultParamValues("payload")),
      t.hasOwnProperty("termsTimeout"))
    ) {
      const i = t.termsTimeout;
      this._authParam.termsTimeout =
        i < 3 || i > 30
          ? this._defaultParamValues("termsTimeout")
          : 60 * i * 1e3;
    } else
      this._authParam.termsTimeout = this._defaultParamValues("termsTimeout");
    if (t.hasOwnProperty("permissionTimeout")) {
      const i = t.permissionTimeout;
      this._authParam.permissionTimeout = 1e3 * i;
    } else
      this._authParam.permissionTimeout =
        this._defaultParamValues("permissionTimeout");
    if (t.hasOwnProperty("idleTimeout")) {
      const i = t.idleTimeout;
      this._authParam.idleTimeout =
        i > 9 ? 1e3 * i : this._defaultParamValues("idleTimeout");
    } else
      this._authParam.idleTimeout = this._defaultParamValues("idleTimeout");
    if (t.hasOwnProperty("replyTimeout")) {
      const i = t.replyTimeout;
      this._authParam.replyTimeout =
        i > 15 ? 1e3 * i : this._defaultParamValues("replyTimeout");
    } else
      this._authParam.replyTimeout = this._defaultParamValues("replyTimeout");
    if (t.hasOwnProperty("enrollIntroTimeout")) {
      let i = t.enrollIntroTimeout;
      i < 5
        ? (i = 5e3)
        : i > 60
        ? (i = this._defaultParamValues("enrollIntroTimeout"))
        : (i *= 1e3),
        (this._authParam.enrollIntroTimeout = i);
    } else
      this._authParam.enrollIntroTimeout =
        this._defaultParamValues("enrollIntroTimeout");
    t.hasOwnProperty("locale") ||
      (this._authParam.locale = this._defaultParamValues("locale"));
  }
  _isExpiredSession() {
    return (
      null !== this._temp_token &&
      (this._state == fioState.PERM_REFUSED &&
        (this._launchModal(),
        this._handleFailure(fioErrCode.SESSION_EXPIRED, "")),
      !0)
    );
  }
  authenticate(t) {
    return new Promise((i, e) => {
      this._isExpiredSession()
        ? e(
            this._state != fioState.PERM_REFUSED
              ? fioErrCode.SESSION_IN_PROGRESS
              : fioErrCode.SESSION_EXPIRED
          )
        : (this._toggleSpinner(),
          (this._reject = e),
          (this._resolve = i),
          (this._isEnrollment = !1),
          (this._isIdVerify = !1),
          this._fillParameters(t),
          fetch(
            "https://widget.faceio.net/?public_app_id=" +
              this._pub_app_id +
              "&app_rand_token=" +
              this._app_rand_token +
              "&op=auth&locale=" +
              this._authParam.locale
          )
            .then((t) => t.json())
            .then((t) => {
              if (this._isEnrollment || this._isIdVerify)
                this._toggleSpinner(),
                  this._reject(fioErrCode.SESSION_IN_PROGRESS);
              else {
                if (200 != t.status) throw t.errCode;
                {
                  const i = this._prepareUi(t.payload);
                  this._toggleSpinner(),
                    i
                      ? (this._launchModal(), this._launchVideoStream())
                      : this._handleFailure(fioErrCode.UI_NOT_READY, null);
                }
              }
            })
            .catch((t) => {
              this._toggleSpinner(), this._handleFailure(t, null);
            }));
    });
  }
  auth(t) {
    return this.authenticate(t);
  }
  recognize(t) {
    return this.authenticate(t);
  }
  enroll(t) {
    return new Promise((i, e) => {
      this._isExpiredSession()
        ? e(
            this._state != fioState.PERM_REFUSED
              ? fioErrCode.SESSION_IN_PROGRESS
              : fioErrCode.SESSION_EXPIRED
          )
        : (this._toggleSpinner(),
          (this._reject = e),
          (this._resolve = i),
          (this._isEnrollment = !0),
          (this._isIdVerify = !1),
          this._fillParameters(t),
          fetch(
            "https://widget.faceio.net/?public_app_id=" +
              this._pub_app_id +
              "&app_rand_token=" +
              this._app_rand_token +
              "&op=enroll&locale=" +
              this._authParam.locale
          )
            .then((t) => t.json())
            .then((t) => {
              if (this._isEnrollment) {
                if (200 != t.status) throw t.errCode;
                {
                  const i = this._prepareUi(t.payload);
                  this._toggleSpinner(),
                    i
                      ? (this._launchModal(), this._enrollUser())
                      : this._handleFailure(fioErrCode.UI_NOT_READY, null);
                }
              } else
                this._toggleSpinner(),
                  this._reject(fioErrCode.SESSION_IN_PROGRESS);
            })
            .catch((t) => {
              this._toggleSpinner(), this._handleFailure(t, null);
            }));
    });
  }
  enrol(t) {
    return this.enroll(t);
  }
  register(t) {
    return this.enroll(t);
  }
  record(t) {
    return this.enroll(t);
  }
  idVerify(t) {
    return new Promise((i, e) => {
      this._isExpiredSession()
        ? e(
            this._state != fioState.PERM_REFUSED
              ? fioErrCode.SESSION_IN_PROGRESS
              : fioErrCode.SESSION_EXPIRED
          )
        : (e(fioErrCode.UI_NOT_READY),
          this._toggleSpinner(),
          (this._reject = e),
          (this._resolve = i),
          (this._isEnrollment = !1),
          (this._isIdVerify = !0),
          this._fillParameters(t),
          fetch(
            "https://widget.faceio.net/?public_app_id=" +
              this._pub_app_id +
              "&app_rand_token=" +
              this._app_rand_token +
              "&op=idverify&locale=" +
              this._authParam.locale
          )
            .then((t) => t.json())
            .then((t) => {
              if (this._isIdVerify) {
                if (200 != t.status) throw t.errCode;
                {
                  const i = this._prepareUi(t.payload);
                  this._toggleSpinner(),
                    i
                      ? (this._launchModal(), this._idVerifyUser())
                      : this._handleFailure(fioErrCode.UI_NOT_READY, null);
                }
              } else
                this._toggleSpinner(),
                  this._reject(fioErrCode.SESSION_IN_PROGRESS);
            })
            .catch((t) => {
              this._toggleSpinner(), this._handleFailure(t, null);
            }));
    });
  }
  idverify(t) {
    return this.idVerify(t);
  }
  Idverify(t) {
    return this.idVerify(t);
  }
  kyc(t) {
    return this.idVerify(t);
  }
  kycVerify(t) {
    return this.idVerify(t);
  }
  verify(t) {
    return this.idVerify(t);
  }
  restartSession() {
    return (
      !(
        !this._refreshSession ||
        null === this._temp_token ||
        (this._state != fioState.AUTH_SUCCESS &&
          this._state != fioState.PERM_REFUSED)
      ) &&
      ((this._temp_token = null),
      (this._state = fioState.UI_READY),
      (this._frame_ack = !1),
      (this._pinPad = !1),
      (this._cnpin = null),
      (this._pin = ""),
      (this._pinmax = 16),
      (this._isEnrollment = !1),
      (this._isIdVerify = !1),
      (this._clearWidget = !0),
      (this._requestLv = !1),
      (this._notification = null),
      (this._notificationTimeout = 0),
      (this._rectColor = "#32cd32"),
      !0)
    );
  }
}
!(function () {
  "use strict";
  let t = document.getElementById("faceio-modal");
  t ||
    ((t = document.createElement("div")),
    t.setAttribute("id", "faceio-modal"),
    document.body.appendChild(t)),
    (faceIO.fioShadowDOM = t.attachShadow({ mode: "open" }));
  const i = document.createElement("script");
  i.setAttribute("type", "text/javascript"),
    i.setAttribute("async", "true"),
    i.setAttribute("src", "https://cdn.faceio.net/facemodel.js"),
    t.appendChild(i);
  const e = document.createElement("div");
  e.setAttribute("id", "fioSpin");
  const s = document.createElement("link");
  s.setAttribute("type", "text/css"),
    s.setAttribute("rel", "stylesheet"),
    s.setAttribute("href", "https://cdn.faceio.net/fio.css"),
    faceIO.fioShadowDOM.appendChild(s),
    faceIO.fioShadowDOM.appendChild(e);
})();
