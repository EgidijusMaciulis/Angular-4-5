"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WSUser = /** @class */ (function () {
    function WSUser(id, ws) {
        this.id = id;
        this.ws = ws;
        this.roomId = 0;
    }
    return WSUser;
}());
exports.WSUser = WSUser;
