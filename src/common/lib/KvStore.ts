import axios from 'axios';

type Option = {
  host: string;
};
type DataOption = {
  key?: string;
  value?: string;
  command?: string;
};

/**
 * Key value store
 */
export class KvStore {
  private static _config: Option;

  static connect(config: Option) {
    this._config = config;
  }

  static async set(key: string, value: any) {
    const data = {
      key: key,
      value: value,
      command: 'set',
    };
    return await this.request(data);
  }

  static async get(key: string) {
    const data = {
      key: key,
      command: 'get',
    };
    return await this.request(data);
  }

  static async delete(key: string) {
    const data = {
      key: key,
      command: 'delete',
    };
    return await this.request(data);
  }

  static async flush() {
    const data = {
      command: 'flush',
    };
    return await this.request(data);
  }

  private static async request(data: DataOption) {
    const _config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const result = await axios.post(`${this._config.host}`, data, _config);
    return result.data;
  }
}
