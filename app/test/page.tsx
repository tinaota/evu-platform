// Simple test page to verify Next.js is working
export default function TestPage() {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>Test Page</h1>
            <p>If you can see this, Next.js is working!</p>
            <p>Time: {new Date().toLocaleTimeString()}</p>
        </div>
    );
}
