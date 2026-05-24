'use strict';

const { HomebridgePluginUiServer, RequestError } = require('@homebridge/plugin-ui-utils');
const { auth, getCameras, generateToken, getRefreshToken } = require('../dist/nest/connection');
const { NestStructure } = require('../dist/nest/structure');
const { NestCam } = require('../dist/nest/cam');

class NestUiServer extends HomebridgePluginUiServer {
  constructor() {
    super();

    /** @type {string|null} */
    this.accessToken = null;
    /** @type {Array|null} */
    this.cameras = null;
    /** @type {boolean} */
    this.ft = false;

    this.onRequest('/auth',             this.handleAuth.bind(this));
    this.onRequest('/logout',           this.handleLogout.bind(this));
    this.onRequest('/owner',            this.handleOwner.bind(this));
    this.onRequest('/cameras',          this.handleCameras.bind(this));
    this.onRequest('/structures',       this.handleStructures.bind(this));
    this.onRequest('/faces',            this.handleFaces.bind(this));
    this.onRequest('/zones',            this.handleZones.bind(this));
    this.onRequest('/generateToken',    this.handleGenerateToken.bind(this));
    this.onRequest('/getRefreshToken',  this.handleGetRefreshToken.bind(this));

    this.ready();
  }

  /** Build a minimal NestConfig object from the stored access token. */
  _config() {
    if (!this.accessToken) return null;
    return { platform: 'Nest-cam', fieldTest: this.ft, access_token: this.accessToken };
  }

  async handleAuth(payload) {
    try {
      this.ft = payload.ft || false;
      this.accessToken = await auth(payload.refreshToken, this.ft);
      this.cameras = null; // invalidate cache after re-auth
      return !!this.accessToken;
    } catch (_err) {
      this.accessToken = null;
      return false;
    }
  }

  handleLogout() {
    this.accessToken = null;
    this.cameras = null;
  }

  async handleOwner() {
    const config = this._config();
    if (!config) return null;
    try {
      const cameras = this.cameras || (await getCameras(config));
      this.cameras = cameras;
      if (cameras && cameras.length > 0) {
        const structure = new NestStructure(cameras[0], config);
        const members = await structure.getMembers();
        return members.find((m) => m.roles.includes('owner')) || null;
      }
    } catch (_err) { /* best-effort */ }
    return null;
  }

  async handleCameras() {
    const config = this._config();
    if (!config) return null;
    try {
      const cameras = this.cameras || (await getCameras(config));
      this.cameras = cameras;
      return cameras;
    } catch (_err) { return null; }
  }

  async handleStructures() {
    const config = this._config();
    if (!config) return null;
    try {
      const cameras = this.cameras || (await getCameras(config));
      this.cameras = cameras;
      const seen = new Set();
      const structures = [];
      for (const cam of cameras) {
        const id = cam.nest_structure_id.replace('structure.', '');
        if (!seen.has(id)) {
          seen.add(id);
          structures.push({ title: cam.nest_structure_name, enum: [id] });
        }
      }
      return structures;
    } catch (_err) { return null; }
  }

  async handleFaces() {
    const config = this._config();
    if (!config) return null;
    try {
      const cameras = this.cameras || (await getCameras(config));
      this.cameras = cameras;
      const seen = new Set();
      const structs = [];
      for (const cam of cameras) {
        const id = cam.nest_structure_id.replace('structure.', '');
        if (!seen.has(id)) {
          seen.add(id);
          structs.push(new NestStructure(cam, config));
        }
      }
      let faces = [];
      for (const s of structs) {
        const f = await s.getFaces();
        if (f) faces = faces.concat(f);
      }
      return faces;
    } catch (_err) { return null; }
  }

  async handleZones() {
    const config = this._config();
    if (!config) return null;
    try {
      const cameras = this.cameras || (await getCameras(config));
      this.cameras = cameras;
      let zones = [];
      for (const cam of cameras) {
        const nestCam = new NestCam(config, cam);
        const z = await nestCam.getZones();
        if (z) zones = zones.concat(z);
      }
      return zones;
    } catch (_err) { return null; }
  }

  handleGenerateToken(payload) {
    return generateToken(payload.ft || false);
  }

  async handleGetRefreshToken(payload) {
    if (!payload.code) return '';
    try {
      return await getRefreshToken(payload.code, payload.ft || false);
    } catch (err) {
      const msg =
        err?.response?.data?.error_description ||
        err?.message ||
        String(err);
      throw new RequestError(msg, { status: 401 });
    }
  }
}

(() => new NestUiServer())();
