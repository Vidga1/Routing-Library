// Определение типов для пути маршрута. Это может быть строка, регулярное выражение или функция.
type RoutePath = string | RegExp | ((path: string) => boolean);

// Описание интерфейса для параметров маршрута.
interface RouteParams {
  [key: string]: string;
}

// Интерфейс описывает структуру каждого маршрута.
interface Route<Params = RouteParams> {
  path: RoutePath; // Путь маршрута.
  onEnter?: (params?: Params) => void | Promise<void>; // Функция, вызываемая при входе на маршрут.
  onLeave?: (params?: Params) => void | Promise<void>; // Функция, вызываемая при покидании маршрута.
  onBeforeEnter?: (params?: Params) => void | Promise<void>; // Функция, вызываемая перед входом на маршрут.
}

// Конфигурация роутера.
interface RouterConfig {
  useHash?: boolean; // Определяет, следует ли использовать hash-роутинг.
}

// Класс роутера.
export class Router<Params = RouteParams> {
  private routes: Route<Params>[] = []; // Массив для хранения всех маршрутов.

  private currentPath: string = ""; // Текущий активный путь.

  // Конструктор роутера.
  constructor(private config: RouterConfig = {}) {
    // Слушатель событий для обработки изменений состояния истории.
    window.addEventListener("popstate", this.handlePopState);
  }

  // Обработчик событий popstate.
  private handlePopState = (): void => {
    // Обрабатываем изменение маршрута.
    this.handleRouteChange(window.location.pathname);
  };

  // Метод для парсинга строковых параметров из URL.
  private static parseParams(paramString: string): RouteParams {
    const params: RouteParams = {};
    if (paramString) {
      paramString.split("&").forEach((param) => {
        const [key, value] = param.split("=");
        params[key] = value;
      });
    }
    return params;
  }

  // Метод для обработки изменения маршрута.
  private handleRouteChange(path: string): void {
    // Разделение пути и параметров запроса.
    const [basePath, paramString] = path.split("?");
    // Если путь не изменился, не делаем ничего.
    if (basePath === this.currentPath) {
      return;
    }
    // Получаем параметры маршрута.
    const params = Router.parseParams(paramString);
    // Находим соответствующий маршрут.
    const matchingRoute = this.routes.find((route) => {
      if (typeof route.path === "string") {
        return basePath === route.path;
      }
      if (route.path instanceof RegExp) {
        return route.path.test(basePath);
      }
      if (typeof route.path === "function") {
        return route.path(basePath);
      }
      return false;
    });

    // Если нашли маршрут, вызываем соответствующие функции.
    if (matchingRoute) {
      matchingRoute.onBeforeEnter?.(params as Params);
      matchingRoute.onEnter?.(params as Params);
      this.currentPath = basePath;
    }
  }

  // Метод для добавления нового маршрута.
  public addRoute(route: Route<Params>): void {
    this.routes.push(route);
  }

  // Метод для навигации по маршруту.
  public navigate(path: string): void {
    // Используем hash или обычный путь в зависимости от конфигурации.
    if (this.config.useHash) {
      window.location.hash = path;
    } else {
      window.history.pushState({}, "", path);
      this.handleRouteChange(path);
    }
  }
}

// Пример использования
const demoRouter = new Router();
demoRouter.addRoute({
  path: "/",
  onEnter: () => console.log("Entered root path"),
});
