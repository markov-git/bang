const incstr = require('incstr');

const createUniqueIdGenerator = (generatorIdentifier: string): (name: string) => string => {
	const uniqIds: Record<string, string> = {};

	const generateNextId: () => string = incstr.idGenerator({
		// Буквы d нету, чтобы убрать сочетание ad,
		// так как его может заблокировать Adblock
		alphabet: 'abcefghijklmnopqrstuvwxyzABCEFGHJKLMNOPQRSTUVWXYZ',
	});

	// Для имени возвращаем его минифицированную версию
	return (name) => {
		if (!uniqIds[name]) {
			uniqIds[name] = generateNextId();
		}
		return uniqIds[name];
	};
};

const localNameIdGenerator = createUniqueIdGenerator('local');
const componentNameIdGenerator = createUniqueIdGenerator('component');

export function getScopedName(localName: string, resourcePath: string): string {
	// Получим название папки, в которой лежит наш index.css
	const componentName = resourcePath
		.split('/')
		.slice(-2, -1)[0];
	const localId = localNameIdGenerator(localName);
	const componentId = componentNameIdGenerator(componentName);
	return `${componentId}_${localId}`;
}