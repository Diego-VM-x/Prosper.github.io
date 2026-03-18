const fs = require('fs');

const files = ['index.html', 'aprende.html', 'tools.html', 'quiz.html', 'route.html'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Solo reemplazamos el enlace específico de Acerca de
    content = content.replace(/<a href="#"([^>]+)>\s*<i className="fas fa-info-circle w-6 text-blue-500"><\/i> Acerca de/g,
        '<a href="acerca.html"$1>\n                                        <i className="fas fa-info-circle w-6 text-blue-500"></i> Acerca de');

    fs.writeFileSync(file, content);
});

console.log('Enlaces de Acerca de actualizados exitosamente en todos los archivos.');
