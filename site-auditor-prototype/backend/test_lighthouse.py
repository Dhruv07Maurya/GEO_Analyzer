import subprocess
import os
import sys
import platform
import tempfile
import time

def test_lighthouse():
    url = "https://example.com"
    print(f"Testing Lighthouse audit for {url}...")
    
    temp_dir = tempfile.gettempdir()
    output_path = os.path.join(temp_dir, f"test_lighthouse_{int(time.time())}.json")
    
    command = [
        "lighthouse.cmd" if platform.system() == "Windows" else "lighthouse",
        url,
        "--output=json",
        f"--output-path={output_path}",
        "--chrome-flags=--headless",
        "--quiet"
    ]
    
    print(f"Running command: {' '.join(command)}")
    
    try:
        result = subprocess.run(
            command,
            timeout=120,
            capture_output=True,
            shell=(platform.system() == "Windows")
        )
        
        if result.returncode == 0:
            print("✅ SUCCESS! Lighthouse ran successfully.")
            import json
            with open(output_path, "r") as f:
                data = json.load(f)
                score = data["categories"]["performance"]["score"]
                print(f"Performance Score: {score}")
            print(f"Report saved to: {output_path}")
        else:
            print("❌ FAILURE! Lighthouse command failed.")
            print("Error output:")
            print(result.stderr.decode())
            
    except Exception as e:
        print(f"❌ EXCEPTION! {str(e)}")

if __name__ == "__main__":
    test_lighthouse()
