# Библиотека Роутинга

Эта библиотека предназначена для управления навигацией в веб-приложениях. Она позволяет определять маршруты, управлять переходами и обрабатывать параметры URL, что делает её идеальным инструментом для одностраничных приложений (SPA).

## Установка

Для установки библиотеки используйте следующую команду:

```bash
npm install routing-library
```

## Быстрый Старт

Вот простой пример, показывающий, как использовать библиотеку для навигации:

```javascript
import { Router } from "routing-library";

const router = new Router();
router.addRoute({
  path: "/",
  onEnter: () => console.log("Entered root path"),
});
```

# Примеры Использования

## Добавление Маршрутов

Добавьте маршруты с помощью метода addRoute:

```javascript
router.addRoute({
  path: "/about",
  onEnter: () => console.log("Entered about page"),
});
```

## Навигация

Используйте метод navigate для перехода к определенному маршруту:

```javascript
router.navigate("/about");
```

## API

### Класс `Router`

- `constructor(config?: RouterConfig)`: Создает новый экземпляр роутера с опциональной конфигурацией.
- `addRoute(route: Route<Params>)`: Добавляет новый маршрут.
- `navigate(path: string)`: Выполняет переход на указанный путь.

### Интерфейс `Route`

- `path`: Определяет путь маршрута.
- `onEnter(params?: Params)`: Вызывается при входе на маршрут.
- `onLeave(params?: Params)`: Вызывается при покидании маршрута.
- `onBeforeEnter(params?: Params)`: Вызывается перед входом на маршрут.

## Конфигурация

### `RouterConfig`

- `useHash`: Определяет, будет ли использоваться hash-роутинг (`true` или `false`).

## Лицензия

Этот проект лицензирован под MIT License.
