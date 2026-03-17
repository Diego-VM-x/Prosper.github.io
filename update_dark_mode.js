const fs = require('fs');
const files = ['index.html', 'aprende.html', 'tools.html', 'quiz.html', 'route.html'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Enable class strategy for dark mode
    if (!content.includes("darkMode: 'class'")) {
        content = content.replace('tailwind.config = {', "tailwind.config = {\n            darkMode: 'class',");
    }

    // Replace mobile bottom nav container classes
    content = content.replace(
        'className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 z-50 pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.05)]"',
        'className="md:hidden fixed bottom-0 left-0 w-full transition-colors duration-300 backdrop-blur-md border-t z-50 pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.05)] dark:bg-gray-900/95 dark:border-gray-800 bg-white/95 border-gray-200"'
    );

    // Replace inactive mobile nav links
    content = content.replace(
        /className="flex flex-col items-center justify-center w-full text-gray-400 hover:text-navy smooth-transition h-full border-t-2 border-transparent pt-1"/g,
        'className="flex flex-col items-center justify-center w-full dark:text-gray-500 text-gray-400 dark:hover:text-white hover:text-navy smooth-transition h-full border-t-2 border-transparent pt-1"'
    );

    // Replace centered ACTIVE home button in mobile nav
    content = content.replace(
        'className="bg-mint text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-white transform hover:scale-105 smooth-transition"',
        'className="bg-mint text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 dark:border-gray-900 border-white transform hover:scale-105 smooth-transition"'
    );

    // Replace centered INACTIVE home button in mobile nav
    content = content.replace(
        /bg-gray-100 text-gray-400 hover:text-mint w-14 h-14 rounded-full flex items-center justify-center shadow-\[0_-2px_10px_rgba\(0,0,0,0.05\)\] border-4 border-white transform hover:scale-105 smooth-transition/g,
        'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-mint dark:hover:text-mint-light w-14 h-14 rounded-full flex items-center justify-center shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-4 border-white dark:border-gray-900 transform hover:scale-105 smooth-transition'
    );

    // Make Dashboard panels dark-compatible
    content = content.replace(
        /bg-white rounded-3xl/g, 
        'bg-white dark:bg-gray-800 rounded-3xl'
    );
    content = content.replace(
        /bg-white rounded-2xl/g, 
        'bg-white dark:bg-gray-800 rounded-2xl'
    );
    content = content.replace(
        /bg-white rounded-xl/g, 
        'bg-white dark:bg-gray-800 rounded-xl'
    );
    content = content.replace(
        /border-gray-100/g,
        'border-gray-100 dark:border-gray-700'
    );

    // Special texts and icons
    content = content.replace(/text-navy(?!.*dark:text-white)/g, 'text-navy dark:text-white');
    content = content.replace(/text-gray-600(?!.*dark:text-gray-300)/g, 'text-gray-600 dark:text-gray-300');
    content = content.replace(/text-gray-500(?!.*dark:text-gray-400)/g, 'text-gray-500 dark:text-gray-400');
    content = content.replace(/text-gray-700(?!.*dark:text-gray-200)/g, 'text-gray-700 dark:text-gray-200');
    content = content.replace(/bg-gray-50(?!.*dark:bg-gray-700)([^"]*?)hover/g, 'bg-gray-50 dark:bg-gray-800$1hover');

    fs.writeFileSync(file, content, 'utf8');
});
console.log('Update complete.');
