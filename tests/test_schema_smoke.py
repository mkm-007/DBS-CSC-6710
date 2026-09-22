"""Schema smoke tests — no MySQL daemon required."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
SCHEMA_DIR = ROOT / "database" / "schemas"
TRIGGER_DIR = ROOT / "database" / "triggers"
DATA_DIR = ROOT / "database" / "data"

REQUIRED_TABLES = {
    "auth",
    "blood_bank",
    "donor",
    "donation",
    "events",
    "orders",
    "storage",
    "reward",
    "services",
    "service_visit",
    "hospital_location",
}


def _sql_blobs():
    files = list(SCHEMA_DIR.glob("*.sql")) + list(TRIGGER_DIR.glob("*.sql"))
    assert files, "expected SQL files under database/"
    return "\n".join(p.read_text(encoding="utf-8", errors="ignore") for p in files)


def test_required_tables_declared():
    blob = _sql_blobs().lower()
    missing = [t for t in REQUIRED_TABLES if f"create table {t}" not in blob]
    assert not missing, f"missing CREATE TABLE for: {missing}"


def test_donation_fks_named():
    donation = (SCHEMA_DIR / "donation.sql").read_text(encoding="utf-8", errors="ignore").lower()
    assert "foreign key" in donation
    assert "donor" in donation and "blood_bank" in donation and "events" in donation


def test_triggers_cover_storage_and_rewards():
    names = {p.name for p in TRIGGER_DIR.glob("*.sql")}
    assert "donation_storage_trigger.sql" in names
    assert "donation_reward_trigger.sql" in names
    assert "order_storage_trigger.sql" in names


def test_seed_data_present():
    assert (DATA_DIR / "data.sql").exists() or any(DATA_DIR.glob("*.sql"))


def test_auth_registration_enum():
    auth = (SCHEMA_DIR / "auth.sql").read_text(encoding="utf-8", errors="ignore")
    assert "BLOOD_BANK" in auth and "DONOR" in auth and "HOSPITAL" in auth


def test_no_obvious_todo_markers_in_core_schema():
    blob = _sql_blobs()
    # Allow comments; fail only on loud unfinished markers in CREATE blocks
    creates = "\n".join(re.findall(r"CREATE TABLE[\s\S]*?(?=CREATE TABLE|\Z)", blob, flags=re.I))
    assert "TODO: implement" not in creates
