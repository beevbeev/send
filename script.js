document.getElementById('updateForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const customRepoName = document.getElementById('customRepoName').value.trim();
    const selectedRepoName = document.getElementById('repoName').value;
    const repoName = customRepoName || selectedRepoName; // استفاده از مقدار ورودی کاربر یا پیشفرض

    const customFilePath = document.getElementById('customFilePath').value.trim();
    const selectedFilePath = document.getElementById('filePath').value;
    const filePath = customFilePath || selectedFilePath; // استفاده از مقدار ورودی کاربر یا پیشفرض

    if (!repoName) {
        document.getElementById('message').textContent = 'لطفاً یک نام ریپوزیتوری معتبر وارد کنید.';
        return;
    }

    if (!filePath) {
        document.getElementById('message').textContent = 'لطفاً یک آدرس فایل معتبر وارد کنید.';
        return;
    }

    const token = document.getElementById('githubToken').value.trim();
    const content = document.getElementById('content').value.trim();
    const owner = 'beevbeev';

    const apiUrl = `https://api.github.com/repos/${owner}/${repoName}/contents/${filePath}`;

    console.log('repoName:', repoName);
    console.log('filePath:', filePath);
    console.log('apiUrl:', apiUrl);

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error('خطا در دریافت فایل: ' + response.statusText);
        }

        const fileData = await response.json();

        const updatedContent = btoa(unescape(encodeURIComponent(content)));

        const updateResponse = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Updating ${filePath} via web form`,
                content: updatedContent,
                sha: fileData.sha
            })
        });

        if (updateResponse.ok) {
            document.getElementById('message').textContent = `${filePath} با موفقیت بروز شد!`;
            setTimeout(() => {
                window.location.href = window.location.href;
            }, 2000);
        } else {
            const errorData = await updateResponse.json();
            document.getElementById('message').textContent = `خطایی رخ داده است در ${filePath}: ` + errorData.message;
        }
    } catch (error) {
        document.getElementById('message').textContent = `خطا: ` + error.message;
        console.error('Error:', error);
    }
});
