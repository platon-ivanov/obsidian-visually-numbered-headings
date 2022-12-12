export class Cache<Value, Key = string | number> {
	private items: Map<Key, Value> = new Map();

	set = (key: Key, value: Value) => {
		this.items.set(key, value);
	};

	get = (key: Key) => {
		return this.items.get(key);
	};

	delete = (key: Key) => {
		return this.items.delete(key);
	};

	clearAll = () => {
		for (const [key] of this.items.entries()) {
			this.delete(key);
		}
	};

	exists = (key: Key) => {
		return this.items.has(key);
	};
}
