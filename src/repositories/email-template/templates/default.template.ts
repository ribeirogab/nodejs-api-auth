import { classNames } from './global.css';

export class DefaultTemplate {
  protected addGlobalStyles(html: string) {
    let htmlWithStyles = html;

    Object.keys(classNames).forEach((key) => {
      const styles = classNames[key] || null;
      const className = `class="${key}"`;

      if (styles) {
        htmlWithStyles = htmlWithStyles.replace(
          new RegExp(className, 'g'),
          `style="${styles.replace(/\n/g, '').trim()}"`,
        );
      }
    });

    return htmlWithStyles;
  }
}
